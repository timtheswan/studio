# **App Name**: HexaMapper

## Core Features:

- Hexagonal Map Display: Display a flat-topped hexagonal grid using a suitable library.
- Pan and Zoom: Enable intuitive panning via click-and-drag and zooming via mouse wheel or pinch gestures.
- Tile Toggle: Allow users to click on individual hexes to toggle their enabled/disabled state. The 'enabled' state will be tracked in a data object.
- Tile State Memory: Stores coordinates of existing tiles (as (x,y) pairs based on the supplied offset rules), and a boolean for whether each tile should be present or not. Remember, valid coordinates must sum to an even number. The columns should also be vertically offset, by a factor of 1 for the columns nearest to 0. This stores which tiles are supposed to exist in this coordinate system.
- Config Export: Generates a downloadable config file with coordinates of all hexes whose toggle is 'enabled', in the specified format. The data should also not include the booleans, which is important because it reduces the data size of the config file significantly

## Style Guidelines:

- Primary color: Forest green (#388E3C) to represent the map.
- Background color: Light grey (#F0F0F0), a desaturated hue to match the map, and allowing contrast with green tiles.
- Accent color: Golden yellow (#FFC107) to highlight interactive elements.
- Font: 'Inter' (sans-serif) for clear and modern interface text.
- Simple, minimalist icons for UI elements. Icons should use the accent color.
- Clean, single-page layout with the map taking center stage.
- Subtle animations on hover and click to provide feedback on tile interaction.
- Tooltip on hovering a hex tile that shows it's relative coordinates