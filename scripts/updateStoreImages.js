const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

function detectProductType(name) {
  const lower = name.toLowerCase();
  if (lower.includes('hoodie')) return 'hoodie';
  if (lower.includes('sweatshirt')) return 'sweatshirt';
  if (lower.includes('t-shirt') || lower.includes('tee')) return 't-shirt';
  return null;
}

async function updateImages() {
  const { data: items, error } = await supabase.from('store_items').select('*');
  if (error) {
    console.error('Failed to fetch store items:', error);
    return;
  }

  for (const item of items) {
    const productType = detectProductType(item.name);
    if (!productType) continue;

    if (item.image_url && item.image_url.includes('generated-mockups')) continue;

    console.log(`Generating image for ${item.name}...`);
    const { data, error: genError } = await supabase.functions.invoke('generate-product-mockup', {
      body: {
        productType,
        designText: 'Glee Club',
        brandInfo: { brand: 'premium', color: { name: 'Spelman Blue', hex: '#0066CC' } },
        placement: 'full-front',
        amazonStyle: true,
        singleMockup: true
      }
    });

    if (genError || !data?.mockupUrl) {
      console.error(`Failed to generate image for ${item.name}:`, genError || data);
      continue;
    }

    const { error: updateError } = await supabase
      .from('store_items')
      .update({ image_url: data.mockupUrl })
      .eq('id', item.id);

    if (updateError) {
      console.error(`Failed to update ${item.name}:`, updateError);
    } else {
      console.log(`Updated ${item.name} image.`);
    }
  }
}

updateImages().then(() => {
  console.log('Image update complete');
  process.exit(0);
});
