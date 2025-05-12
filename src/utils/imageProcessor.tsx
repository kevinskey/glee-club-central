import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

async function main() {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    
    // Create an HTML page with canvas to manipulate the image
    await page.setContent(`
      <html>
        <body>
          <canvas id="canvas" style="display: none;"></canvas>
          <script>
            async function processImage() {
              const canvas = document.getElementById('canvas');
              const ctx = canvas.getContext('2d');
              
              return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = function() {
                  // Set canvas dimensions to match image
                  canvas.width = img.width;
                  canvas.height = img.height;
                  
                  // Draw original image
                  ctx.drawImage(img, 0, 0);
                  
                  // Get image data
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const data = imageData.data;
                  
                  // Convert to white (keeping transparency)
                  for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 0) { // If not fully transparent
                      data[i] = 255;     // Red
                      data[i + 1] = 255; // Green
                      data[i + 2] = 255; // Blue
                      // Alpha stays the same
                    }
                  }
                  
                  // Put processed image back on canvas
                  ctx.putImageData(imageData, 0, 0);
                  
                  // Return as data URL
                  resolve(canvas.toDataURL('image/png'));
                };
                
                img.src = 'https://lovable-ai-production.s3.us-west-2.amazonaws.com/cb5429e5-ef5e-4b87-8109-1e1216828e19.png';
              });
            }
          </script>
        </body>
      </html>
    `);

    // Process the image
    console.log('Processing image...');
    const whiteLogoDataUrl = await page.evaluate(() => {
      return (window as any).processImage();
    });

    // Extract the base64 data
    const base64Data = whiteLogoDataUrl.replace(/^data:image\/png;base64,/, '');
    
    // Save the white logo
    const outputDir = path.join(process.cwd(), 'public', 'lovable-uploads');
    fs.mkdirSync(outputDir, { recursive: true });
    
    const outputPath = path.join(outputDir, 'cb5429e5-ef5e-4b87-8109-1e1216828e19-white.png');
    fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
    
    console.log(`White logo saved to ${outputPath}`);
  } catch (error) {
    console.error('Error processing image:', error);
  } finally {
    await browser.close();
  }
}

// This function will be executed when this file is run directly
if (require.main === module) {
  main().catch(console.error);
}
