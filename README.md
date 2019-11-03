# Mystera GUI 

# Development

All UI elements position mappings are in `src/Config/UI*.json` files.
For all coordinate values, the value in the files have been compiled using a Browser window width of 1024px (930 * 522.66 actual game size (`canvas` element)).
This means that for all relative positioning (needed to handle multiple resolutions and client window sizes), the code does a difference between the actual resolution and 930 * 522.66.
If you ever want to map other in game UI elements, please make sure the `canvas` element dimensions are exactly the ones cited above.