#!/bin/bash
# Download DSEG Fonts from official source

echo "Downloading DSEG Fonts..."

cd public/fonts

# Download individual fonts from keshikan.net
echo "Downloading DSEG7 Modern..."
wget -q "https://www.keshikan.net/fonts/DSEG7Modern-Regular.ttf" -O dseg7modern/DSEG7Modern-Regular.ttf

echo "Downloading DSEG14 Modern..."
wget -q "https://www.keshikan.net/fonts/DSEG14Modern-Regular.ttf" -O dseg7modern/DSEG14Modern-Regular.ttf

echo "Downloading DSEG Weather..."
wget -q "https://www.keshikan.net/fonts/DSEGWeather-Regular.ttf" -O dseg7modern/DSEGWeather-Regular.ttf

echo ""
echo "Fonts installed!"
echo "Location: public/fonts/dseg7modern/"
ls -lh dseg7modern/ 2>/dev/null || echo "Download failed. Please download manually from: https://www.keshikan.net/fonts-e.html"
