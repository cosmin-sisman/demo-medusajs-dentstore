import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createInventoryLevelsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDentalData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const storeModuleService = container.resolve(Modules.STORE);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  logger.info("Starting dental store seed...");

  // Get existing store
  const [store] = await storeModuleService.listStores();

  // Update store name to Dental Store
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "DentStore - Dental Supplies",
      },
    },
  });
  logger.info("Updated store name to DentStore.");

  // Get default sales channel
  const [defaultSalesChannel] =
    await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });

  // Get shipping profile
  const shippingProfiles =
    await fulfillmentModuleService.listShippingProfiles({ type: "default" });
  const shippingProfile = shippingProfiles[0];

  // Get stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const stockLocation = stockLocations[0];

  // ─── Create Dental Categories ───────────────────────────────────────────

  logger.info("Creating dental product categories...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Instrumente Dentare",
          description:
            "Instrumente de mana si rotative pentru proceduri stomatologice",
          is_active: true,
        },
        {
          name: "Materiale Dentare",
          description:
            "Materiale de obturatie, cimenturi, adezivi si compozite",
          is_active: true,
        },
        {
          name: "Echipamente",
          description:
            "Echipamente si aparatura pentru cabinetul stomatologic",
          is_active: true,
        },
        {
          name: "Igienizare si Sterilizare",
          description:
            "Produse pentru dezinfectie, sterilizare si igiena cabinetului",
          is_active: true,
        },
        {
          name: "Consumabile",
          description:
            "Manusi, masti, servetele, pahare si alte consumabile de unica folosinta",
          is_active: true,
        },
        {
          name: "Ortodontie",
          description:
            "Brackets, arcuri, elastice si accesorii pentru tratament ortodontic",
          is_active: true,
        },
      ],
    },
  });

  const getCategory = (name: string) =>
    categoryResult.find((cat) => cat.name === name)!;

  logger.info("Finished creating dental categories.");

  // ─── Create Dental Products ──────────────────────────────────────────

  logger.info("Creating dental products...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // ─── INSTRUMENTE DENTARE ─────────────────────────────────
        {
          title: "Kit Sonde Dentare Explorer (Set 5 buc)",
          category_ids: [getCategory("Instrumente Dentare").id],
          description:
            "Set complet de 5 sonde dentare din otel inoxidabil de inalta calitate. Include sonda dreapta, sonda curba, sonda de buzunar parodontal, sonda Nabers si sonda Shepherd. Ideale pentru examinare si diagnostic. Autoclavabile la 134°C.",
          handle: "kit-sonde-dentare",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
          ],
          options: [
            {
              title: "Tip",
              values: ["Standard", "Premium"],
            },
          ],
          variants: [
            {
              title: "Standard",
              sku: "DENT-SONDE-STD",
              options: { Tip: "Standard" },
              prices: [
                { amount: 4500, currency_code: "eur" },
                { amount: 5200, currency_code: "usd" },
              ],
            },
            {
              title: "Premium",
              sku: "DENT-SONDE-PREM",
              options: { Tip: "Premium" },
              prices: [
                { amount: 7800, currency_code: "eur" },
                { amount: 8900, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Oglinda Dentara cu Maner (Set 12 buc)",
          category_ids: [getCategory("Instrumente Dentare").id],
          description:
            "Set de 12 oglinzi dentare cu maner ergonomic din otel inoxidabil. Oglinda plana cu diametru de 22mm, oferind vizibilitate excelenta. Maner standard #5. Autoclavabile.",
          handle: "oglinzi-dentare",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
          ],
          options: [
            {
              title: "Marime Oglinda",
              values: ["#4 (22mm)", "#5 (24mm)"],
            },
          ],
          variants: [
            {
              title: "#4 (22mm)",
              sku: "DENT-OGLINDA-4",
              options: { "Marime Oglinda": "#4 (22mm)" },
              prices: [
                { amount: 2400, currency_code: "eur" },
                { amount: 2800, currency_code: "usd" },
              ],
            },
            {
              title: "#5 (24mm)",
              sku: "DENT-OGLINDA-5",
              options: { "Marime Oglinda": "#5 (24mm)" },
              prices: [
                { amount: 2600, currency_code: "eur" },
                { amount: 3000, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Cleste Extractie Dentara Superior",
          category_ids: [getCategory("Instrumente Dentare").id],
          description:
            "Cleste pentru extractie dentara superioara din otel inoxidabil forjat. Design ergonomic pentru prehensiune optima. Varfuri profilate pentru adaptare anatomica. Model universal pentru premolari si molari superiori.",
          handle: "cleste-extractie-superior",
          weight: 220,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
          ],
          options: [
            {
              title: "Model",
              values: ["Nr. 17", "Nr. 18L", "Nr. 18R"],
            },
          ],
          variants: [
            {
              title: "Nr. 17",
              sku: "DENT-CLESTE-17",
              options: { Model: "Nr. 17" },
              prices: [
                { amount: 3200, currency_code: "eur" },
                { amount: 3700, currency_code: "usd" },
              ],
            },
            {
              title: "Nr. 18L",
              sku: "DENT-CLESTE-18L",
              options: { Model: "Nr. 18L" },
              prices: [
                { amount: 3200, currency_code: "eur" },
                { amount: 3700, currency_code: "usd" },
              ],
            },
            {
              title: "Nr. 18R",
              sku: "DENT-CLESTE-18R",
              options: { Model: "Nr. 18R" },
              prices: [
                { amount: 3200, currency_code: "eur" },
                { amount: 3700, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Freze Diamantate (Set 10 buc)",
          category_ids: [getCategory("Instrumente Dentare").id],
          description:
            "Set de 10 freze diamantate pentru turbina, granulatie medie. Include forme: sferica, para, con, cilindru si flacara. Dimensiuni FG standard. Ideale pentru preparatii, finisari si ajustari ocluzale.",
          handle: "freze-diamantate-set",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            {
              title: "Granulatie",
              values: ["Fina", "Medie", "Groasa"],
            },
          ],
          variants: [
            {
              title: "Fina",
              sku: "DENT-FREZE-FINE",
              options: { Granulatie: "Fina" },
              prices: [
                { amount: 1800, currency_code: "eur" },
                { amount: 2100, currency_code: "usd" },
              ],
            },
            {
              title: "Medie",
              sku: "DENT-FREZE-MED",
              options: { Granulatie: "Medie" },
              prices: [
                { amount: 1800, currency_code: "eur" },
                { amount: 2100, currency_code: "usd" },
              ],
            },
            {
              title: "Groasa",
              sku: "DENT-FREZE-GROSS",
              options: { Granulatie: "Groasa" },
              prices: [
                { amount: 1800, currency_code: "eur" },
                { amount: 2100, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // ─── MATERIALE DENTARE ───────────────────────────────────
        {
          title: "Compozit Nanohybrid Universal 4g",
          category_ids: [getCategory("Materiale Dentare").id],
          description:
            "Compozit fotopolimerizabil nanohybrid de ultima generatie. Radiopac, cu fluorescenta naturala. Excelenta adaptare marginala si lustru de durata. Indicat pentru restaurari anterioare si posterioare. Seringa 4g.",
          handle: "compozit-nanohybrid",
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
          ],
          options: [
            {
              title: "Culoare",
              values: ["A1", "A2", "A3", "A3.5", "B1", "B2"],
            },
          ],
          variants: [
            {
              title: "A1",
              sku: "DENT-COMP-A1",
              options: { Culoare: "A1" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
            {
              title: "A2",
              sku: "DENT-COMP-A2",
              options: { Culoare: "A2" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
            {
              title: "A3",
              sku: "DENT-COMP-A3",
              options: { Culoare: "A3" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
            {
              title: "A3.5",
              sku: "DENT-COMP-A35",
              options: { Culoare: "A3.5" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
            {
              title: "B1",
              sku: "DENT-COMP-B1",
              options: { Culoare: "B1" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
            {
              title: "B2",
              sku: "DENT-COMP-B2",
              options: { Culoare: "B2" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Adeziv Dentar Universal 5ml",
          category_ids: [getCategory("Materiale Dentare").id],
          description:
            "Adeziv dentar universal de generatia 8, compatibil cu tehnica self-etch, selective-etch si total-etch. Flacon 5ml cu dozator precis. Aderenta excelenta la smalt, dentina, metale, ceramica si compozit.",
          handle: "adeziv-dentar-universal",
          weight: 40,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Volum",
              values: ["5ml", "10ml"],
            },
          ],
          variants: [
            {
              title: "5ml",
              sku: "DENT-ADEZIV-5",
              options: { Volum: "5ml" },
              prices: [
                { amount: 4500, currency_code: "eur" },
                { amount: 5200, currency_code: "usd" },
              ],
            },
            {
              title: "10ml",
              sku: "DENT-ADEZIV-10",
              options: { Volum: "10ml" },
              prices: [
                { amount: 7800, currency_code: "eur" },
                { amount: 8900, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Ciment Ionomer de Sticla (GIC)",
          category_ids: [getCategory("Materiale Dentare").id],
          description:
            "Ciment glasionomer autopolimerizabil pentru cimentare definitiva de coroane, punti si inlay-uri. Elibereaza fluor pentru protectie anticarie. Kit pulbere 15g + lichid 10ml. Timp de priza 4-5 minute.",
          handle: "ciment-gic",
          weight: 80,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
            },
          ],
          options: [
            {
              title: "Tip",
              values: ["Cimentare", "Obturatie", "Liner"],
            },
          ],
          variants: [
            {
              title: "Cimentare",
              sku: "DENT-GIC-CEM",
              options: { Tip: "Cimentare" },
              prices: [
                { amount: 3500, currency_code: "eur" },
                { amount: 4000, currency_code: "usd" },
              ],
            },
            {
              title: "Obturatie",
              sku: "DENT-GIC-OBT",
              options: { Tip: "Obturatie" },
              prices: [
                { amount: 3800, currency_code: "eur" },
                { amount: 4300, currency_code: "usd" },
              ],
            },
            {
              title: "Liner",
              sku: "DENT-GIC-LIN",
              options: { Tip: "Liner" },
              prices: [
                { amount: 2800, currency_code: "eur" },
                { amount: 3200, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // ─── ECHIPAMENTE ─────────────────────────────────────────
        {
          title: "Lampa Fotopolimerizare LED",
          category_ids: [getCategory("Echipamente").id],
          description:
            "Lampa de fotopolimerizare LED wireless cu intensitate luminoasa de 2000 mW/cm². Spectru larg 385-515nm, compatibila cu toate materialele fotopolimerizabile. Baterie Li-ion cu autonomie de 300 cicluri. Include 3 programe: Standard (10s), Ramp (15s), Pulse (20s).",
          handle: "lampa-fotopolimerizare-led",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
            },
          ],
          options: [
            {
              title: "Model",
              values: ["Standard", "Pro"],
            },
          ],
          variants: [
            {
              title: "Standard",
              sku: "DENT-LAMPA-STD",
              options: { Model: "Standard" },
              prices: [
                { amount: 15000, currency_code: "eur" },
                { amount: 17000, currency_code: "usd" },
              ],
            },
            {
              title: "Pro",
              sku: "DENT-LAMPA-PRO",
              options: { Model: "Pro" },
              prices: [
                { amount: 25000, currency_code: "eur" },
                { amount: 28500, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Scaler Ultrasonic Piezoelectric",
          category_ids: [getCategory("Echipamente").id],
          description:
            "Scaler ultrasonic piezoelectric cu frecventa 25-36 kHz. Include 5 varfuri interschimbabile (G1-G4 + P1). Sistem de irigare integrat cu control de flux. Putere reglabila pe 10 trepte. Compatibil cu varfuri EMS si Satelec.",
          handle: "scaler-ultrasonic",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Compatibilitate",
              values: ["EMS", "Satelec"],
            },
          ],
          variants: [
            {
              title: "EMS",
              sku: "DENT-SCALER-EMS",
              options: { Compatibilitate: "EMS" },
              prices: [
                { amount: 42000, currency_code: "eur" },
                { amount: 48000, currency_code: "usd" },
              ],
            },
            {
              title: "Satelec",
              sku: "DENT-SCALER-SAT",
              options: { Compatibilitate: "Satelec" },
              prices: [
                { amount: 42000, currency_code: "eur" },
                { amount: 48000, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // ─── IGIENIZARE SI STERILIZARE ───────────────────────────
        {
          title: "Solutie Dezinfectant Suprafete 1L",
          category_ids: [getCategory("Igienizare si Sterilizare").id],
          description:
            "Dezinfectant de nivel inalt pentru suprafetele cabinetului stomatologic. Actiune bactericida, fungicida si virucida in 1 minut. Formula fara aldehide, compatibila cu suprafetele sensibile. Concentratie gata de utilizare.",
          handle: "dezinfectant-suprafete",
          weight: 1100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png",
            },
          ],
          options: [
            {
              title: "Volum",
              values: ["1L", "5L"],
            },
          ],
          variants: [
            {
              title: "1L",
              sku: "DENT-DEZINF-1L",
              options: { Volum: "1L" },
              prices: [
                { amount: 1200, currency_code: "eur" },
                { amount: 1400, currency_code: "usd" },
              ],
            },
            {
              title: "5L",
              sku: "DENT-DEZINF-5L",
              options: { Volum: "5L" },
              prices: [
                { amount: 4500, currency_code: "eur" },
                { amount: 5200, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Pungi Sterilizare Autoclav (200 buc)",
          category_ids: [getCategory("Igienizare si Sterilizare").id],
          description:
            "Pungi autoadezive pentru sterilizare in autoclav. Indicator de sterilizare integrat cu schimbare de culoare. Hartie medicala de 60g/m² cu film transparent. Conform EN 868-5. Cutie de 200 bucati.",
          handle: "pungi-sterilizare",
          weight: 400,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
            },
          ],
          options: [
            {
              title: "Marime",
              values: ["90x230mm", "135x280mm", "200x330mm"],
            },
          ],
          variants: [
            {
              title: "90x230mm",
              sku: "DENT-PUNGI-S",
              options: { Marime: "90x230mm" },
              prices: [
                { amount: 1500, currency_code: "eur" },
                { amount: 1700, currency_code: "usd" },
              ],
            },
            {
              title: "135x280mm",
              sku: "DENT-PUNGI-M",
              options: { Marime: "135x280mm" },
              prices: [
                { amount: 1800, currency_code: "eur" },
                { amount: 2100, currency_code: "usd" },
              ],
            },
            {
              title: "200x330mm",
              sku: "DENT-PUNGI-L",
              options: { Marime: "200x330mm" },
              prices: [
                { amount: 2200, currency_code: "eur" },
                { amount: 2500, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // ─── CONSUMABILE ─────────────────────────────────────────
        {
          title: "Manusi Nitril fara Pudra (100 buc)",
          category_ids: [getCategory("Consumabile").id],
          description:
            "Manusi de examinare din nitril, fara pudra, fara latex. Texturate la nivelul degetelor pentru prehensiune superioara. Grosime 0.1mm, rezistente la perforare. Cutie de 100 bucati. Conform EN 455 si EN 374.",
          handle: "manusi-nitril",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
            },
          ],
          options: [
            {
              title: "Marime",
              values: ["S", "M", "L", "XL"],
            },
            {
              title: "Culoare",
              values: ["Albastru", "Negru"],
            },
          ],
          variants: [
            {
              title: "S / Albastru",
              sku: "DENT-MANUSI-S-ALB",
              options: { Marime: "S", Culoare: "Albastru" },
              prices: [
                { amount: 800, currency_code: "eur" },
                { amount: 950, currency_code: "usd" },
              ],
            },
            {
              title: "M / Albastru",
              sku: "DENT-MANUSI-M-ALB",
              options: { Marime: "M", Culoare: "Albastru" },
              prices: [
                { amount: 800, currency_code: "eur" },
                { amount: 950, currency_code: "usd" },
              ],
            },
            {
              title: "L / Albastru",
              sku: "DENT-MANUSI-L-ALB",
              options: { Marime: "L", Culoare: "Albastru" },
              prices: [
                { amount: 800, currency_code: "eur" },
                { amount: 950, currency_code: "usd" },
              ],
            },
            {
              title: "XL / Albastru",
              sku: "DENT-MANUSI-XL-ALB",
              options: { Marime: "XL", Culoare: "Albastru" },
              prices: [
                { amount: 800, currency_code: "eur" },
                { amount: 950, currency_code: "usd" },
              ],
            },
            {
              title: "S / Negru",
              sku: "DENT-MANUSI-S-NEG",
              options: { Marime: "S", Culoare: "Negru" },
              prices: [
                { amount: 900, currency_code: "eur" },
                { amount: 1050, currency_code: "usd" },
              ],
            },
            {
              title: "M / Negru",
              sku: "DENT-MANUSI-M-NEG",
              options: { Marime: "M", Culoare: "Negru" },
              prices: [
                { amount: 900, currency_code: "eur" },
                { amount: 1050, currency_code: "usd" },
              ],
            },
            {
              title: "L / Negru",
              sku: "DENT-MANUSI-L-NEG",
              options: { Marime: "L", Culoare: "Negru" },
              prices: [
                { amount: 900, currency_code: "eur" },
                { amount: 1050, currency_code: "usd" },
              ],
            },
            {
              title: "XL / Negru",
              sku: "DENT-MANUSI-XL-NEG",
              options: { Marime: "XL", Culoare: "Negru" },
              prices: [
                { amount: 900, currency_code: "eur" },
                { amount: 1050, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Masti Chirurgicale 3 Straturi (50 buc)",
          category_ids: [getCategory("Consumabile").id],
          description:
            "Masti chirurgicale de protectie cu 3 straturi si clip nazal ajustabil. Eficienta de filtrare bacteriana (BFE) > 98%. Elastic auricular confortabil. Cutie de 50 bucati. Conform EN 14683 Tip IIR.",
          handle: "masti-chirurgicale",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png",
            },
          ],
          options: [
            {
              title: "Culoare",
              values: ["Albastru", "Verde", "Roz"],
            },
          ],
          variants: [
            {
              title: "Albastru",
              sku: "DENT-MASTI-ALB",
              options: { Culoare: "Albastru" },
              prices: [
                { amount: 500, currency_code: "eur" },
                { amount: 600, currency_code: "usd" },
              ],
            },
            {
              title: "Verde",
              sku: "DENT-MASTI-VERD",
              options: { Culoare: "Verde" },
              prices: [
                { amount: 500, currency_code: "eur" },
                { amount: 600, currency_code: "usd" },
              ],
            },
            {
              title: "Roz",
              sku: "DENT-MASTI-ROZ",
              options: { Culoare: "Roz" },
              prices: [
                { amount: 500, currency_code: "eur" },
                { amount: 600, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Aspiratoare Saliva de Unica Folosinta (100 buc)",
          category_ids: [getCategory("Consumabile").id],
          description:
            "Aspiratoare de saliva din PVC flexibil, cu varf detasabil si filtr integrat. Lungime 15cm, design ergonomic cu flexibilitate in toate directiile. Cutie de 100 bucati. Disponibile in mai multe culori.",
          handle: "aspiratoare-saliva",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png",
            },
          ],
          options: [
            {
              title: "Culoare",
              values: ["Alb", "Albastru", "Verde"],
            },
          ],
          variants: [
            {
              title: "Alb",
              sku: "DENT-ASPIR-ALB",
              options: { Culoare: "Alb" },
              prices: [
                { amount: 350, currency_code: "eur" },
                { amount: 400, currency_code: "usd" },
              ],
            },
            {
              title: "Albastru",
              sku: "DENT-ASPIR-BLUE",
              options: { Culoare: "Albastru" },
              prices: [
                { amount: 350, currency_code: "eur" },
                { amount: 400, currency_code: "usd" },
              ],
            },
            {
              title: "Verde",
              sku: "DENT-ASPIR-GREEN",
              options: { Culoare: "Verde" },
              prices: [
                { amount: 350, currency_code: "eur" },
                { amount: 400, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },

        // ─── ORTODONTIE ──────────────────────────────────────────
        {
          title: "Brackets Metalice Roth .022 (Set 20 buc)",
          category_ids: [getCategory("Ortodontie").id],
          description:
            "Set de 20 brackets metalice cu prescriptie Roth, slot .022. Baza retentiva cu mesh dublu pentru aderenta superioara. Include brackets pentru incisivi, canini si premolari (5-5 superior si inferior). Marcaj colorat pentru identificare rapida.",
          handle: "brackets-metalice-roth",
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
            },
          ],
          options: [
            {
              title: "Slot",
              values: [".018", ".022"],
            },
          ],
          variants: [
            {
              title: ".018",
              sku: "DENT-BRACK-018",
              options: { Slot: ".018" },
              prices: [
                { amount: 2800, currency_code: "eur" },
                { amount: 3200, currency_code: "usd" },
              ],
            },
            {
              title: ".022",
              sku: "DENT-BRACK-022",
              options: { Slot: ".022" },
              prices: [
                { amount: 2800, currency_code: "eur" },
                { amount: 3200, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
        {
          title: "Elastice Ortodontice Latex-Free (1000 buc)",
          category_ids: [getCategory("Ortodontie").id],
          description:
            "Elastice intermaxilare din material sintetic, fara latex. Forta constanta pe toata durata de utilizare. Disponibile in diverse forte si dimensiuni. Pachet de 1000 bucati in sortimente de culori.",
          handle: "elastice-ortodontice",
          weight: 60,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png",
            },
          ],
          options: [
            {
              title: "Forta",
              values: ["Light (2oz)", "Medium (4oz)", "Heavy (6oz)"],
            },
          ],
          variants: [
            {
              title: "Light (2oz)",
              sku: "DENT-ELASTIC-LIGHT",
              options: { Forta: "Light (2oz)" },
              prices: [
                { amount: 600, currency_code: "eur" },
                { amount: 700, currency_code: "usd" },
              ],
            },
            {
              title: "Medium (4oz)",
              sku: "DENT-ELASTIC-MED",
              options: { Forta: "Medium (4oz)" },
              prices: [
                { amount: 600, currency_code: "eur" },
                { amount: 700, currency_code: "usd" },
              ],
            },
            {
              title: "Heavy (6oz)",
              sku: "DENT-ELASTIC-HEAVY",
              options: { Forta: "Heavy (6oz)" },
              prices: [
                { amount: 600, currency_code: "eur" },
                { amount: 700, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel.id }],
        },
      ],
    },
  });

  logger.info("Finished creating dental products.");

  // ─── Create Inventory Levels for New Products ────────────────────────

  logger.info("Creating inventory levels for dental products...");

  const { data: allInventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  // Get existing inventory levels to avoid duplicates
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
    filters: {
      location_id: stockLocation.id,
    },
  });

  const existingItemIds = new Set(
    existingLevels.map((l: { inventory_item_id: string }) => l.inventory_item_id)
  );

  const newInventoryLevels = allInventoryItems
    .filter((item: { id: string }) => !existingItemIds.has(item.id))
    .map((item: { id: string }) => ({
      location_id: stockLocation.id,
      stocked_quantity: 500,
      inventory_item_id: item.id,
    }));

  if (newInventoryLevels.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: newInventoryLevels,
      },
    });
  }

  logger.info(
    `Created ${newInventoryLevels.length} inventory levels for dental products.`
  );

  logger.info("Dental store seed completed successfully!");
}
