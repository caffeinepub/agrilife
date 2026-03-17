# AgriLife

## Current State
- Crop snapshots on HomeScreen have a "View Details" button that is not wired up
- Blog "Discover More" button shows a toast saying "Full article coming soon!"
- Core Values "Explore Our Values" button has no action

## Requested Changes (Diff)

### Add
- Crop snapshot detail modal: when "View Details" is tapped on a crop card in HomeScreen, open a Dialog showing full crop details (health, soil moisture, temperature, expected harvest, variety, wind shield status, NPK levels)
- Blog article full-read modal: when "Discover More" is tapped on any article card in BlogScreen OR in the HomeScreen horizontal scroll, open a Sheet/Dialog showing the full article title, category, summary, and expanded body content (generate meaningful content per article)
- Core values interactive modal: when "Explore Our Values" is tapped in HomeScreen, open a Dialog/Sheet showing all 3 core values as expanded cards with icons, title, and description paragraph

### Modify
- HomeScreen crop "View Details" button: add onClick handler to open crop detail dialog
- BlogScreen "Discover More" button: replace toast with a full article sheet
- HomeScreen "Discover More" in article cards: same as above, open article sheet
- HomeScreen "Explore Our Values" button: open core values modal

### Remove
- Toast message "Full article coming soon!" from Discover More buttons

## Implementation Plan
1. In HomeScreen.tsx: add state for selected crop, render a Dialog with full crop stats when a crop card's "View Details" is clicked
2. In BlogScreen.tsx: add state for selected article, render a Sheet with full article content (title, category tag, summary + full body paragraphs) when "Discover More" is clicked. Add body content to SAMPLE_ARTICLES.
3. In HomeScreen.tsx: add "Discover More" onClick on article preview cards to open same article sheet
4. In HomeScreen.tsx: add state for showCoreValues, render a Dialog/Sheet with all core values expanded (icon, title, description) when "Explore Our Values" is clicked
