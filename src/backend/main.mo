import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type UserRole = {
    #farmer;
    #consumer;
    #ngo;
  };

  module UserRole {
    public func compare(role1 : UserRole, role2 : UserRole) : Order.Order {
      let index1 = switch (role1) {
        case (#farmer) { 0 };
        case (#consumer) { 1 };
        case (#ngo) { 2 };
      };
      let index2 = switch (role2) {
        case (#farmer) { 0 };
        case (#consumer) { 1 };
        case (#ngo) { 2 };
      };
      if (index1 < index2) { #less } else if (index1 > index2) { #greater } else {
        #equal;
      };
    };
  };

  public type UserProfile = {
    name : Text;
    role : UserRole;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      switch (Text.compare(profile1.name, profile2.name)) {
        case (#equal) { UserRole.compare(profile1.role, profile2.role) };
        case (order) { order };
      };
    };
  };

  type CommunityPost = {
    author : Text;
    content : Text;
  };

  module CommunityPost {
    public func compare(post1 : CommunityPost, post2 : CommunityPost) : Order.Order {
      Text.compare(post1.author, post2.author);
    };
  };

  type CropSnapshot = {
    name : Text;
    variety : Text;
    soilMoisture : Nat;
    temperature : Nat;
    expectedHarvest : Text;
    health : Nat;
  };

  module CropSnapshot {
    public func compare(crop1 : CropSnapshot, crop2 : CropSnapshot) : Order.Order {
      switch (Text.compare(crop1.name, crop2.name)) {
        case (#equal) { Text.compare(crop1.variety, crop2.variety) };
        case (order) { order };
      };
    };
  };

  type BlogArticle = {
    title : Text;
    category : Text;
    summary : Text;
    body : Text;
  };

  module BlogArticle {
    public func compare(article1 : BlogArticle, article2 : BlogArticle) : Order.Order {
      switch (Text.compare(article1.title, article2.title)) {
        case (#equal) { Text.compare(article1.category, article2.category) };
        case (order) { order };
      };
    };
  };

  type CoreValue = {
    title : Text;
    description : Text;
  };

  module CoreValue {
    public func compare(value1 : CoreValue, value2 : CoreValue) : Order.Order {
      Text.compare(value1.title, value2.title);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let communityPosts = List.empty<CommunityPost>();
  let cropSnapshots = Map.empty<Principal, List.List<CropSnapshot>>();
  let blogArticles = List.empty<BlogArticle>();
  let coreValues = List.empty<CoreValue>();

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func addCommunityPost(content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let author = switch (userProfiles.get(caller)) {
      case (?profile) { profile.name };
      case (null) { "Anonymous" };
    };
    let post = {
      author;
      content;
    };
    communityPosts.add(post);
  };

  public query ({ caller }) func getAllPosts() : async [CommunityPost] {
    communityPosts.toArray();
  };

  public shared ({ caller }) func addCropSnapshot(crop : CropSnapshot) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add crop snapshots");
    };
    let userCrops = switch (cropSnapshots.get(caller)) {
      case (?current) {
        current.add(crop);
        current;
      };
      case (null) {
        let newList = List.empty<CropSnapshot>();
        newList.add(crop);
        newList;
      };
    };
    cropSnapshots.add(caller, userCrops);
  };

  public query ({ caller }) func getCallerCrops() : async [CropSnapshot] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view crop snapshots");
    };
    switch (cropSnapshots.get(caller)) {
      case (?crops) { crops.toArray() };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func addBlogArticle(article : BlogArticle) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add blog articles");
    };
    blogArticles.add(article);
  };

  public query ({ caller }) func getAllArticles() : async [BlogArticle] {
    blogArticles.toArray();
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [BlogArticle] {
    blogArticles.toArray().filter(func(article) { article.category == category });
  };

  public query ({ caller }) func getCoreValues() : async [CoreValue] {
    coreValues.toArray();
  };

  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize the system");
    };

    if (coreValues.size() == 0) {
      let values = [
        { title = "Integrity"; description = "Honest and transparent practices in all we do." },
        { title = "Innovation"; description = "Embracing new technologies and methods." },
        { title = "Community Empowerment"; description = "Supporting local farmers and communities." },
      ];
      for (value in values.values()) {
        coreValues.add(value);
      };
    };

    if (blogArticles.size() == 0) {
      let articles = [
        {
          title = "Organic Farming in the Philippines";
          category = "Farming";
          summary = "Benefits and challenges of organic agriculture.";
          body = "Organic farming promotes sustainable practices and healthier produce...";
        },
        {
          title = "Climate-Resilient Crops";
          category = "Agriculture";
          summary = "Adapting to changing weather patterns.";
          body = "Farmers are encouraged to plant crops that can withstand extreme weather...";
        },
        {
          title = "Urban Gardening Tips";
          category = "Gardening";
          summary = "Growing food in small spaces.";
          body = "Urban gardening allows city dwellers to grow their own food...";
        },
      ];
      for (article in articles.values()) {
        blogArticles.add(article);
      };
    };
  };
};
