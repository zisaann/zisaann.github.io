
/*
  AKSARAY ÜNİVERSİTESİ DİJİTAL MENÜ
  Ürün fiyatları ve alerjen bilgileri henüz doğrulanmadığı için
  fiyat gösterilmez; alerjen filtreleri seçildiğinde doğrulanmamış
  ürünler gösterilmez.
*/

const MENU_DATA = [
  {
    category: "Kahvaltı",
    subcategories: [
      {
        name: "Kahvaltı menüleri",
        emoji: "🍳",
        products: [
          "2 Kişilik Kahvaltı",
          "Tek Kişilik Kahvaltı",
          "Kahvaltı Tabağı (Tek Kişilik)",
          "Pişi Kahvaltı",
          "Pankek Tabağı"
        ]
      },
      {
        name: "Sıcak kahvaltı",
        emoji: "🍳",
        products: ["Menemen", "Mıhlama", "Yumurtalı Ekmek", "Gözleme"]
      },
      {
        name: "Yumurta çeşitleri",
        emoji: "🍳",
        products: [
          "Sade Yumurta",
          "Sucuklu Yumurta",
          "Omlet",
          "Beyaz Peynirli Yumurta",
          "Kaşar Peynirli Yumurta"
        ]
      },
      {
        name: "Tostlar",
        emoji: "🥪",
        products: ["Kaşarlı Tost", "Karışık Tost", "Ayvalık Tostu", "Akdeniz Tostu"]
      }
    ]
  },
  {
    category: "Başlangıçlar",
    subcategories: [
      {
        name: "Soğuk başlangıçlar",
        emoji: "🥙",
        products: [
          "Humus",
          "Haydari",
          "Havuç Tarator",
          "Bruschetta",
          "Yaprak Sarma"
        ]
      },
      {
        name: "Çorbalar",
        emoji: "🍲",
        products: ["Mercimek Çorbası", "Domates Çorbası", "Kremalı Mantar Çorbası"]
      }
    ]
  },
  {
    category: "Atıştırmalıklar",
    subcategories: [
      {
        name: "Atıştırmalıklar",
        emoji: "🍟",
        products: [
          "Patates Kızartması",
          "Çıtır Tavuk Tabağı",
          "Combo Tabak",
          "Soğan Halkası",
          "Karışık Börek Tabağı"
        ]
      }
    ]
  },
  {
    category: "Ana yemekler",
    subcategories: [
      {
        name: "Pizzalar",
        emoji: "🍕",
        products: ["Margarita Pizza", "Karışık Pizza", "Tavuklu Pizza", "Akdeniz Pizza"]
      },
      {
        name: "Burgerler",
        emoji: "🍔",
        products: [
          "Hamburger",
          "Cheeseburger",
          "Smash Burger",
          "Cafe de Pars Burger",
          "Chicken Burger"
        ]
      },
      {
        name: "Dürümler",
        emoji: "🌯",
        products: ["Tavuklu Dürüm", "Çıtır Tavuk Dürüm", "Etli Dürüm"]
      },
      {
        name: "Bowl",
        emoji: "🥗",
        products: [
          "Somon Bowl",
          "Beef Bowl",
          "Izgara Tavuk Bowl",
          "Çıtır Tavuk Bowl",
          "Falafel Bowl",
          "Köfte Bowl"
        ]
      },
      {
        name: "Makarnalar",
        emoji: "🍝",
        products: [
          "Tavuklu Fettuccine",
          "Tavuklu Penne",
          "Körili Tavuklu Makarna",
          "Mac and Cheese"
        ]
      },
      {
        name: "Beyaz etler",
        emoji: "🍗",
        products: [
          "Izgara Tavuk Şiş",
          "Mantarlı Soslu Tavuk",
          "Beğendi Yatağında Piliç Külbastı",
          "Köri Soslu Tavuk",
          "Barbekü Soslu Tavuk",
          "Tavuklu Çökertme Kebabı",
          "Tavuklu Fajita"
        ]
      },
      {
        name: "Balıklar",
        emoji: "🐟",
        products: [
          "Izgara Somon",
          "Izgara Levrek",
          "Izgara Çipura",
          "Mezgit Tava",
          "Hamsi Tava"
        ]
      },
      {
        name: "Kırmızı etler",
        emoji: "🥩",
        products: [
          "Izgara Köfte",
          "Pideli Balaban Köfte",
          "Etli Çökertme Kebabı",
          "Izgara Lokum Bonfile",
          "Karışık Izgara"
        ]
      }
    ]
  },
  {
    category: "Salatalar",
    subcategories: [
      {
        name: "Salatalar",
        emoji: "🥗",
        products: [
          "Akdeniz Salata",
          "Çoban Salata",
          "Çok Tahıllı Salata",
          "Roka Salata",
          "Çıtır Tavuk Salata",
          "Tavuklu Sezar Salata"
        ]
      }
    ]
  },
  {
    category: "Tatlılar",
    subcategories: [
      {
        name: "Tatlılar",
        emoji: "🍰",
        products: [
          "Kızarmış Dondurma",
          "Crème Brûlée",
          "Waffle",
          "Lotuslu Krep Roll",
          "Brownie Cup",
          "Magnolia",
          "Profiterol",
          "Tiramisu",
          "Supangle",
          "Frambuazlı Cheesecake",
          "Fıstıklı San Sebastian"
        ]
      }
    ]
  },
  {
    category: "İçecekler",
    subcategories: [
      {
        name: "Soğuk içecekler",
        emoji: "🥤",
        products: [
          "Su",
          "Soda",
          "Meyveli Soda",
          "Churchill",
          "Ayran",
          "Cola",
          "Fanta",
          "Sprite",
          "Fuse Tea",
          "Red Bull",
          "Şalgam",
          "Cool Lime"
        ]
      },
      {
        name: "Sıcak içecekler",
        emoji: "☕",
        products: [
          "Çay",
          "Bitki Çayı",
          "Türk Kahvesi",
          "Dibek Kahvesi",
          "Menengiç Kahvesi",
          "Filtre Kahve",
          "Espresso",
          "Americano",
          "Cappuccino",
          "Latte",
          "Salep"
        ]
      }
    ]
  }
];

const CATEGORIES = ["Tümü", ...MENU_DATA.map(item => item.category)];

const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "milk", label: "Süt ve ürünleri" },
  { id: "egg", label: "Yumurta" },
  { id: "peanut", label: "Yer fıstığı" },
  { id: "treeNuts", label: "Kuruyemiş" },
  { id: "soy", label: "Soya" },
  { id: "sesame", label: "Susam" },
  { id: "fish", label: "Balık" },
  { id: "shellfish", label: "Kabuklu deniz ürünleri" },
  { id: "mustard", label: "Hardal" },
  { id: "celery", label: "Kereviz" },
  { id: "lupin", label: "Acı bakla" },
  { id: "sulphites", label: "Sülfitler" },
  { id: "molluscs", label: "Midye / Kalamar" }
];


const PRODUCT_INFO_OVERRIDES = {
  "2 Kişilik Kahvaltı": {
    price: 520,
    description: "Peynir, zeytin, domates, salatalık, yumurta ve çeşitli kahvaltılıklarla hazırlanan iki kişilik kahvaltı sunumu.",
    allergens: ["milk", "egg", "gluten", "sesame"]
  },
  "Tek Kişilik Kahvaltı": {
    price: 290,
    description: "Peynir, zeytin, taze sebzeler ve kahvaltılık ürünlerden oluşan tek kişilik kahvaltı tabağı.",
    allergens: ["milk", "egg", "gluten", "sesame"]
  },
  "Kahvaltı Tabağı (Tek Kişilik)": {
    price: 240,
    description: "Peynir, zeytin, domates, salatalık ve kahvaltılık eşlikçilerle sunulan kahvaltı tabağı.",
    allergens: ["milk", "egg", "gluten"]
  },
  "Pişi Kahvaltı": {
    price: 190,
    description: "Pişi ve kahvaltılık eşlikçilerle hazırlanan sıcak kahvaltı seçeneği.",
    allergens: ["gluten", "egg", "milk"]
  },
  "Pankek Tabağı": {
    price: 180,
    description: "Pankeklerin tatlı soslar ve çeşitli eşlikçilerle sunulduğu kahvaltı tabağı.",
    allergens: ["gluten", "egg", "milk"]
  },
  "Menemen": {
    price: 140,
    description: "Domates, biber ve yumurtayla hazırlanan geleneksel sıcak kahvaltılık.",
    allergens: ["egg"]
  },
  "Mıhlama": {
    price: 180,
    description: "Mısır unu, tereyağı ve peynirle hazırlanan sıcak Karadeniz lezzeti.",
    allergens: ["milk"]
  },
  "Yumurtalı Ekmek": {
    price: 100,
    description: "Yumurtaya bulanarak pişirilen ekmek dilimleri.",
    allergens: ["egg", "gluten"]
  },
  "Gözleme": {
    price: 140,
    description: "İnce açılmış hamurun çeşitli iç harçlarla hazırlanıp pişirilmesiyle sunulan geleneksel lezzet.",
    allergens: ["gluten"]
  },
  "Sade Yumurta": {
    price: 90,
    description: "Tereyağı veya sıvı yağ ile hazırlanan sade yumurta.",
    allergens: ["egg", "milk"]
  },
  "Sucuklu Yumurta": {
    price: 140,
    description: "Yumurta ve sucukla hazırlanan sıcak kahvaltılık.",
    allergens: ["egg"]
  },
  "Omlet": {
    price: 120,
    description: "Çırpılmış yumurtayla tavada hazırlanan sade omlet.",
    allergens: ["egg", "milk"]
  },
  "Beyaz Peynirli Yumurta": {
    price: 135,
    description: "Yumurta ve beyaz peynirle hazırlanan sıcak kahvaltılık.",
    allergens: ["egg", "milk"]
  },
  "Kaşar Peynirli Yumurta": {
    price: 140,
    description: "Yumurta ve kaşar peyniriyle hazırlanan sıcak kahvaltılık.",
    allergens: ["egg", "milk"]
  },
  "Kaşarlı Tost": {
    price: 110,
    description: "Tost ekmeği ve kaşar peyniriyle hazırlanan sıcak tost.",
    allergens: ["gluten", "milk"]
  },
  "Karışık Tost": {
    price: 130,
    description: "Kaşar peyniri ve şarküteri ürünleriyle hazırlanan sıcak tost.",
    allergens: ["gluten", "milk"]
  },
  "Ayvalık Tostu": {
    price: 160,
    description: "Çeşitli peynir ve şarküteri malzemeleriyle hazırlanan doyurucu tost.",
    allergens: ["gluten", "milk"]
  },
  "Akdeniz Tostu": {
    price: 145,
    description: "Peynir ve sebze ağırlıklı malzemelerle hazırlanan tost.",
    allergens: ["gluten", "milk"]
  },
  "Humus": {
    price: 110,
    description: "Nohut, tahin, limon ve zeytinyağıyla hazırlanan soğuk meze.",
    allergens: ["sesame"]
  },
  "Haydari": {
    price: 100,
    description: "Yoğurt, sarımsak ve çeşitli baharatlarla hazırlanan soğuk meze.",
    allergens: ["milk"]
  },
  "Havuç Tarator": {
    price: 100,
    description: "Havuç ve yoğurtla hazırlanan soğuk meze.",
    allergens: ["milk"]
  },
  "Bruschetta": {
    price: 130,
    description: "Ekmek dilimleri üzerine domates, zeytinyağı ve baharatlarla hazırlanan başlangıç.",
    allergens: ["gluten"]
  },
  "Yaprak Sarma": {
    price: 110,
    description: "Pirinçli ve baharatlı iç harçla hazırlanan yaprak sarma.",
    allergens: []
  },
  "Mercimek Çorbası": {
    price: 90,
    description: "Mercimek, sebze ve baharatlarla hazırlanan geleneksel çorba.",
    allergens: []
  },
  "Domates Çorbası": {
    price: 100,
    description: "Domatesle hazırlanan, isteğe göre süt veya peynir içerebilen sıcak çorba.",
    allergens: ["milk", "gluten"]
  },
  "Kremalı Mantar Çorbası": {
    price: 120,
    description: "Mantar ve krema ile hazırlanan sıcak çorba.",
    allergens: ["milk", "gluten"]
  },
  "Patates Kızartması": {
    price: 110,
    description: "Altın rengini alana kadar kızartılmış patates dilimleri.",
    allergens: []
  },
  "Çıtır Tavuk Tabağı": {
    price: 210,
    description: "Pane kaplamalı çıtır tavuk parçaları ve eşlikçilerle sunulan tabak.",
    allergens: ["gluten", "egg"]
  },
  "Combo Tabak": {
    price: 230,
    description: "Çeşitli sıcak atıştırmalıkların bir arada sunulduğu paylaşım tabağı.",
    allergens: ["gluten", "egg", "milk"]
  },
  "Soğan Halkası": {
    price: 120,
    description: "Kaplanıp kızartılmış çıtır soğan halkaları.",
    allergens: ["gluten"]
  },
  "Karışık Börek Tabağı": {
    price: 160,
    description: "Çeşitli iç harçlarla hazırlanmış böreklerin bir arada sunumu.",
    allergens: ["gluten", "milk", "egg"]
  },
  "Margarita Pizza": {
    price: 230,
    description: "Domates sosu, mozzarella peyniri ve fesleğenle hazırlanan pizza.",
    allergens: ["gluten", "milk"]
  },
  "Karışık Pizza": {
    price: 290,
    description: "Peynir, sebze ve çeşitli şarküteri malzemeleriyle hazırlanan pizza.",
    allergens: ["gluten", "milk"]
  },
  "Tavuklu Pizza": {
    price: 270,
    description: "Tavuk parçaları, peynir ve domates sosuyla hazırlanan pizza.",
    allergens: ["gluten", "milk"]
  },
  "Akdeniz Pizza": {
    price: 260,
    description: "Sebzeler, peynir ve Akdeniz esintili malzemelerle hazırlanan pizza.",
    allergens: ["gluten", "milk"]
  },
  "Hamburger": {
    price: 230,
    description: "Burger ekmeği, hamburger köftesi ve çeşitli garnitürlerle hazırlanan klasik burger.",
    allergens: ["gluten", "sesame"]
  },
  "Cheeseburger": {
    price: 250,
    description: "Hamburger köftesi, peynir ve burger ekmeğiyle hazırlanan burger.",
    allergens: ["gluten", "milk", "sesame"]
  },
  "Smash Burger": {
    price: 270,
    description: "Tavada bastırılarak pişirilen köfte, burger ekmeği ve soslarla hazırlanan burger.",
    allergens: ["gluten", "milk", "sesame"]
  },
  "Cafe de Pars Burger": {
    price: 290,
    description: "Özel sunumla hazırlanan burger; içeriği işletmenin reçetesine göre değişebilir.",
    allergens: ["gluten", "milk", "sesame", "egg"]
  },
  "Chicken Burger": {
    price: 220,
    description: "Tavuk eti, burger ekmeği ve garnitürlerle hazırlanan burger.",
    allergens: ["gluten", "egg", "sesame"]
  },
  "Tavuklu Dürüm": {
    price: 180,
    description: "Tavuk parçaları, lavaş ve sebzelerle hazırlanan dürüm.",
    allergens: ["gluten"]
  },
  "Çıtır Tavuk Dürüm": {
    price: 200,
    description: "Pane tavuk parçaları, lavaş ve soslarla hazırlanan dürüm.",
    allergens: ["gluten", "egg"]
  },
  "Etli Dürüm": {
    price: 230,
    description: "Et parçaları, lavaş ve çeşitli garnitürlerle hazırlanan dürüm.",
    allergens: ["gluten"]
  },
  "Somon Bowl": {
    price: 320,
    description: "Somon, tahıl veya pirinç tabanı ve sebzelerle hazırlanan kase.",
    allergens: ["fish", "soy", "sesame"]
  },
  "Beef Bowl": {
    price: 300,
    description: "Dana eti, tahıl veya pirinç tabanı ve sebzelerle hazırlanan kase.",
    allergens: ["soy", "sesame"]
  },
  "Chicken Teriyaki Bowl": {
    price: 260,
    description: "Teriyaki soslu tavuk, pirinç ve sebzelerle hazırlanan kase.",
    allergens: ["soy", "gluten", "sesame"]
  },
  "Izgara Tavuk Bowl": {
    price: 240,
    description: "Izgara tavuk, tahıl veya pirinç tabanı ve sebzelerle hazırlanan kase.",
    allergens: []
  },
  "Falafel Bowl": {
    price: 220,
    description: "Falafel, sebzeler ve tahıl veya pirinç tabanıyla hazırlanan kase.",
    allergens: ["sesame", "gluten"]
  },
  "Köfte Bowl": {
    price: 260,
    description: "Köfte, sebzeler ve tahıl veya pirinç tabanıyla hazırlanan kase.",
    allergens: ["gluten", "egg"]
  },
  "Tavuklu Fettuccine": {
    price: 240,
    description: "Fettuccine makarna, tavuk ve kremalı veya özel sosla hazırlanan yemek.",
    allergens: ["gluten", "milk", "egg"]
  },
  "Tavuklu Penne": {
    price: 230,
    description: "Penne makarna ve tavuk parçalarıyla hazırlanan sıcak yemek.",
    allergens: ["gluten", "milk"]
  },
  "Körili Tavuklu Makarna": {
    price: 240,
    description: "Tavuk, makarna ve köri aromalı sosla hazırlanan yemek.",
    allergens: ["gluten", "milk"]
  },
  "Mac and Cheese": {
    price: 210,
    description: "Makarna ve peynir sosuyla hazırlanan kremamsı yemek.",
    allergens: ["gluten", "milk"]
  },
  "Izgara Tavuk Şiş": {
    price: 250,
    description: "Baharatlarla marine edilip ızgarada pişirilen tavuk şiş.",
    allergens: []
  },
  "Mantarlı Soslu Tavuk": {
    price: 280,
    description: "Tavuk ve mantarla hazırlanan soslu ana yemek.",
    allergens: ["milk"]
  },
  "Beğendi Yatağında Piliç Külbastı": {
    price: 310,
    description: "Piliç külbastı ve közlenmiş patlıcanlı beğendiyle hazırlanan ana yemek.",
    allergens: ["milk", "gluten"]
  },
  "Köri Soslu Tavuk": {
    price: 270,
    description: "Köri aromalı sosla hazırlanan tavuk yemeği.",
    allergens: ["milk"]
  },
  "Barbekü Soslu Tavuk": {
    price: 270,
    description: "Barbekü sosuyla lezzetlendirilen tavuk yemeği.",
    allergens: ["soy", "mustard"]
  },
  "Tavuklu Çökertme Kebabı": {
    price: 290,
    description: "Tavuk, ince kızarmış patates ve yoğurtlu sosla hazırlanan yemek.",
    allergens: ["milk"]
  },
  "Tavuklu Fajita": {
    price: 280,
    description: "Tavuk, biber ve soğanla hazırlanan sıcak fajita.",
    allergens: []
  },
  "Izgara Köfte": {
    price: 290,
    description: "Baharatlarla hazırlanan köftelerin ızgarada pişirilmesiyle sunulan ana yemek.",
    allergens: ["gluten", "egg"]
  },
  "Pideli Balaban Köfte": {
    price: 320,
    description: "Köfte, pide parçaları, yoğurt ve sosla hazırlanan geleneksel tabak.",
    allergens: ["gluten", "milk", "egg"]
  },
  "Etli Çökertme Kebabı": {
    price: 360,
    description: "Dana eti, ince kızarmış patates ve yoğurtlu sosla hazırlanan ana yemek.",
    allergens: ["milk"]
  },
  "Izgara Lokum Bonfile": {
    price: 480,
    description: "Izgarada pişirilen dana bonfileyle hazırlanan ana yemek.",
    allergens: []
  },
  "Karışık Izgara": {
    price: 450,
    description: "Farklı ızgara et çeşitlerinin bir arada sunulduğu ana yemek.",
    allergens: []
  },
  "Akdeniz Salata": {
    price: 150,
    description: "Taze yeşillikler, domates, salatalık ve Akdeniz tarzı eşlikçilerle hazırlanan salata.",
    allergens: ["milk"]
  },
  "Çoban Salata": {
    price: 120,
    description: "Domates, salatalık, biber, soğan ve yeşilliklerle hazırlanan salata.",
    allergens: []
  },
  "Çok Tahıllı Salata": {
    price: 170,
    description: "Tahıl karışımı, taze sebzeler ve salata sosuyla hazırlanan salata.",
    allergens: ["gluten", "sesame"]
  },
  "Roka Salata": {
    price: 140,
    description: "Roka, domates ve salata sosuyla hazırlanan ferah salata.",
    allergens: []
  },
  "Çıtır Tavuk Salata": {
    price: 190,
    description: "Çıtır tavuk parçaları ve taze salata malzemeleriyle hazırlanan salata.",
    allergens: ["gluten", "egg"]
  },
  "Tavuklu Sezar Salata": {
    price: 200,
    description: "Tavuk, marul, kruton ve Sezar sosuyla hazırlanan salata.",
    allergens: ["gluten", "milk", "egg", "fish"]
  },
  "Kızarmış Dondurma": {
    price: 160,
    description: "Dondurmanın dış kaplaması kızartılarak hazırlanan tatlı.",
    allergens: ["milk", "gluten", "egg"]
  },
  "Crème Brûlée": {
    price: 170,
    description: "Krema, yumurta ve şekerle hazırlanan, üzeri karamelize edilen tatlı.",
    allergens: ["milk", "egg"]
  },
  "Waffle": {
    price: 190,
    description: "Waffle hamuru ve çeşitli meyve, sos veya tatlı eşlikçilerle sunulan tatlı.",
    allergens: ["gluten", "egg", "milk"]
  },
  "Lotuslu Krep Roll": {
    price: 190,
    description: "Krep ve Lotus bisküvi kremasıyla hazırlanan rulo tatlı.",
    allergens: ["gluten", "milk", "soy"]
  },
  "Brownie Cup": {
    price: 160,
    description: "Çikolatalı brownie parçaları ve tatlı eşlikçilerle hazırlanan kupa tatlısı.",
    allergens: ["gluten", "egg", "milk", "soy"]
  },
  "Magnolia": {
    price: 150,
    description: "Sütlü krema, bisküvi ve meyve katmanlarıyla hazırlanan tatlı.",
    allergens: ["milk", "gluten"]
  },
  "Profiterol": {
    price: 160,
    description: "Hamur topları, krema ve çikolata sosuyla hazırlanan tatlı.",
    allergens: ["gluten", "egg", "milk", "soy"]
  },
  "Tiramisu": {
    price: 170,
    description: "Kahve aromalı katmanlar ve kremayla hazırlanan İtalyan tatlısı.",
    allergens: ["gluten", "egg", "milk"]
  },
  "Supangle": {
    price: 140,
    description: "Çikolata aromalı, yoğun kıvamlı sütlü tatlı.",
    allergens: ["milk", "gluten", "soy"]
  },
  "Frambuazlı Cheesecake": {
    price: 180,
    description: "Peynirli krema tabanı ve frambuazlı üst katmanla hazırlanan cheesecake.",
    allergens: ["milk", "gluten", "egg"]
  },
   "Fıstıklı San Sebastian": {
    price: 200,
    description: "Peynirli San Sebastian tatlısının fıstıkla sunulan çeşidi.",
    allergens: ["milk", "egg", "peanut", "treeNuts"]
  },
  "Izgara Somon": {
    price: 340,
    description: "Izgarada pişirilen somon, uygun garnitürlerle servis edilir.",
    allergens: ["fish"]
  },
  "Izgara Levrek": {
    price: 320,
    description: "Izgarada pişirilen levrek, taze eşlikçilerle sunulur.",
    allergens: ["fish"]
  },
  "Izgara Çipura": {
  price: 320,
  description: "Izgarada pişirilen çipura, uygun garnitürlerle servis edilir.",
  allergens: ["fish"],
  allergensVerified: true
},
"Mezgit Tava": {
  price: 250,
  description: "Kaplanıp tavada kızartılan mezgit, uygun eşlikçilerle sunulur.",
  allergens: ["fish", "gluten"],
  allergensVerified: false
},
"Hamsi Tava": {
  price: 220,
  description: "Tavada pişirilen hamsi, geleneksel eşlikçilerle servis edilir.",
  allergens: ["fish", "gluten"],
  allergensVerified: false
},
};

const PRICE_BY_SUBCATEGORY = [
  { match: /kahvaltı menüleri/i, price: 250 },
  { match: /sıcak kahvaltı/i, price: 140 },
  { match: /yumurta/i, price: 120 },
  { match: /tost/i, price: 140 },
  { match: /soğuk başlangıç/i, price: 110 },
  { match: /çorba/i, price: 100 },
  { match: /atıştırmalık/i, price: 150 },
  { match: /pizza/i, price: 260 },
  { match: /burger/i, price: 240 },
  { match: /dürüm/i, price: 200 },
  { match: /bowl/i, price: 240 },
  { match: /makarna/i, price: 230 },
  { match: /beyaz et/i, price: 280 },
  { match: /kırmızı et/i, price: 380 },
  { match: /salata/i, price: 160 },
  { match: /tatlı/i, price: 160 },
  { match: /soğuk içecek/i, price: 50 },
  { match: /sıcak içecek/i, price: 60 }
];

function getProductDetails(name, subcategory) {
  const override = PRODUCT_INFO_OVERRIDES[name];

  if (override) {
    return {
      ...override,
      allergensVerified: false
    };
  }

  const lowerName = name.toLocaleLowerCase("tr-TR");
  const priceRule = PRICE_BY_SUBCATEGORY.find(rule =>
    rule.match.test(subcategory)
  );

  let allergens = [];

  if (/kahvaltı|pankek|pişi|gözleme|börek|tost|pizza|makarna|krep|waffle|ekmek|kruton/.test(lowerName)) {
    allergens.push("gluten");
  }
  if (/peynir|kaşar|krema|süt|yoğurt|magnolia|profiterol|cheesecake|dondurma|latte|cappuccino|salep|mac and cheese/.test(lowerName)) {
    allergens.push("milk");
  }
  if (/yumurta|omlet|menemen|pankek|waffle|brownie|profiterol|tiramisu|cheesecake/.test(lowerName)) {
    allergens.push("egg");
  }
  if (/tavuk|köfte|burger|bonfile|etli|fajita|ızgara/.test(lowerName)) {
    allergens.push("egg");
  }
  if (/teriyaki|soya/.test(lowerName)) {
    allergens.push("soy", "gluten");
  }
  if (/somon|balık|sezar/.test(lowerName)) {
    allergens.push("fish");
  }
  if (/fıstık|fındık|badem|ceviz|kuruyemiş/.test(lowerName)) {
    allergens.push("treeNuts");
  }

  const descriptionByCategory = {
    "Kahvaltı": `${name}, kahvaltılık eşlikçilerle sunulan bir kahvaltı seçeneğidir.`,
    "Başlangıçlar": `${name}, ana yemek öncesinde veya paylaşım için sunulan bir başlangıçtır.`,
    "Atıştırmalıklar": `${name}, ara öğün veya paylaşım için sunulan sıcak atıştırmalık seçeneğidir.`,
    "Ana yemekler": `${name}, doyurucu bir ana yemek olarak servis edilir.`,
    "Salatalar": `${name}, taze salata malzemeleri ve soslarla hazırlanan bir seçenektir.`,
    "Tatlılar": `${name}, yemek sonrasında tercih edilebilecek tatlı seçeneklerinden biridir.`,
    "İçecekler": `${name}, soğuk veya sıcak olarak tercih edilebilen içecek seçeneğidir.`
  };

  return {
    price: priceRule ? priceRule.price : 100,
    description: descriptionByCategory[
      Object.keys(descriptionByCategory).find(category =>
        category.toLocaleLowerCase("tr-TR") ===
        (subcategory || "").toLocaleLowerCase("tr-TR")
      )
    ] || `${name}, menüde sunulan ürünlerden biridir. İçerik ve sunum kullanılan tarife göre değişebilir.`,
    allergens: [...new Set(allergens)],
    allergensVerified: false
  };
}

// Ürünler, yukarıdaki menü gruplarından oluşturulur.
const PRODUCTS = MENU_DATA.flatMap(group =>
  group.subcategories.flatMap(subcategory =>
    subcategory.products.map((name, index) => ({
      id: `${group.category}-${subcategory.name}-${index}`,
      name,
      category: group.category,
      subcategory: subcategory.name,
      emoji: subcategory.emoji,
    
image: ({
  // Pizzalar
  "Margarita Pizza": "images/margaritapizza.webp",
  "Karışık Pizza": "images/karisikpizza.webp",
  "Tavuklu Pizza": "images/tavuklupizza.webp",
  "Akdeniz Pizza": "images/italianopizza.webp",

  // Burgerler
  "Hamburger": "images/hamburger.jpg",
  "Cheeseburger": "images/cheeseburger.jpg",
  "Smash Burger": "images/smashburger.jpg",
  "Cafe de Pars Burger": "images/cafedeparisburger.jpg",
  "Chicken Burger": "images/chickenburger.jpg",

  // Dürümler
  "Etli Dürüm": "images/etlidurum.jpg",
  "Çıtır Tavuk Dürüm": "images/citirtavukludurum.jpg",
  "Tavuklu Dürüm": "images/tavukludurum.jpg",
  
  // Bowllar
  "Beef Bowl": "images/beefbowl.jpg",
  "Köfte Bowl": "images/köftebowl.jpg",
  "Falafel Bowl": "images/falafelbowl.jpg",
  "Somon Bowl": "images/somonbowl.jpg",
  "Izgara Tavuk Bowl": "images/izgarabowl.jpg",
  "Çıtır Tavuk Bowl": "images/cıtırtavukbowl.jpg",

  // Makarnalar
  "Mac and Cheese": "images/macnadcheese.jpg",
  "Körili Tavuklu Makarna": "images/körilitavuklupenne.jpg",
  "Tavuklu Penne": "images/tavuklupenne.jpg",
  "Tavuklu Fettuccine": "images/tavuklufettucine.jpg",

  // Beyaz etler
  "Barbekü Soslu Tavuk": "images/barbekutavuk.jpg",
  "Tavuklu Çökertme Kebabı": "images/cokertmekebabi.jpg",
  "Mantarlı Soslu Tavuk": "images/mantarsoslutavuk.jpg",
  "Izgara Tavuk Şiş": "images/tavuksis.jpg",
  "Beğendi Yatağında Piliç Külbastı": "images/pilickulbasti.jpg",
  "Tavuklu Fajita": "images/etlifajita.jpg",
  "Köri Soslu Tavuk": "images/körisoslutavuk.jpg",

  // Kırmızı etler
  "Etli Çökertme Kebabı": "images/etlicokertmekebabi.jpg",
  "Izgara Lokum Bonfile": "images/izgaralokumbonfile.jpg",
  "Izgara Köfte": "images/izgaraköfte.jpg",
  "Karışık Izgara": "images/karisikizgara.jpg",
  "Pideli Balaban Köfte": "images/balabanköfte.jpg",

  // Salatalar
  "Akdeniz Salata": "images/akdenizsalata.jpg",
  "Çıtır Tavuk Salata": "images/citirtavuksalata.jpg",
  "Çok Tahıllı Salata": "images/coktahillisalata.jpg",
  "Çoban Salata": "images/cobansalata.jpg",
  "Roka Salata": "images/rokasalata.jpg",
  "Tavuklu Sezar Salata": "images/tavuklusezarsalata.jpg",

  // Atıştırmalıklar
  "Çıtır Tavuk Tabağı": "images/citirtavuktabagı.jpg",
  "Combo Tabak": "images/combotabak.jpg",
  "Karışık Börek Tabağı": "images/karisikborektabagi.jpg",
  "Patates Kızartması": "images/patatestabagi.jpg",
  "Soğan Halkası": "images/soganhalkasi.jpg",

  // Tatlılar
  "Brownie Cup": "images/browniecup.jpg",
  "Crème Brûlée": "images/cremebrule.jpg",
  "Fıstıklı San Sebastian": "images/fistiklisansebastian.jpg",
  "Frambuazlı Cheesecake": "images/frambuazlıcheesacake.jpg",
  "Kızarmış Dondurma": "images/kizarmisdondurma.jpg",
  "Lotuslu Krep Roll": "images/kreproll.jpg",
  "Magnolia": "images/magnolya.jpg",
  "Profiterol": "images/profiterol.jpg",
  "Supangle": "images/supangle.jpg",
  "Tiramisu": "images/tiramisu.jpg",
  "Waffle": "images/waffle.jpg",

  // Soğuk içecekler
  "Cool Lime": "images/coollime.jpg",
  "Cola": "images/cola.jpg",
  "Fuse Tea": "images/fusetea.jpg",
  "Fanta": "images/fanta.jpg",
  "Meyveli Soda": "images/meyvelisoda.jpg",
  "Soda": "images/soda.jpg",
  "Red Bull": "images/redbull.jpg",
  "Sprite": "images/sprite.jpg",
  "Su": "images/su.jpg",
  "Şalgam": "images/şalgam.jpg",
  "Churchill": "images/churcill.jpg",
  "Ayran": "images/ayran.jpg",

  // Sıcak içecekler
  "Americano": "images/americano.jpg",
  "Cappuccino": "images/cappucino.jpg",
  "Bitki Çayı": "images/bitkicayı.jpg",
  "Çay": "images/cay.jpg",
  "Salep": "images/salep.jpg",
  "Espresso": "images/espresso.jpg",
  "Dibek Kahvesi": "images/dibek.jpg",
  "Filtre Kahve": "images/filtrekahve.jpg",
  "Latte": "images/latte.jpg",
  "Menengiç Kahvesi": "images/menengic.jpg",
  "Türk Kahvesi": "images/turkkahvesi.jpg",

  // Soğuk başlangıçlar
  "Bruschetta": "images/bruschetta.jpg",
  "Humus": "images/humus.jpg",
  "Haydari": "images/haydari.jpg",
  "Havuç Tarator": "images/tarator.jpg",
  "Yaprak Sarma": "images/yapraksarma.jpg",

  // Çorbalar
  "Domates Çorbası": "images/domates.jpg",
  "Kremalı Mantar Çorbası": "images/kremalimantar.jpg",
  "Mercimek Çorbası": "images/mercimek.jpg",
  
    // Kahvaltılıklar
  "2 Kişilik Kahvaltı": "images/ikikisikahvaltı.jpg",
  "Kahvaltı Tabağı (Tek Kişilik)": "images/kahvaltitabagi.jpg",
  "Pankek Tabağı": "images/pankek.jpg",
  "Tek Kişilik Kahvaltı": "images/tekkisikahvaltı.jpg",
  "Pişi Kahvaltı": "images/pisikahvalti.jpg",

    // Sıcak kahvaltı
  "Menemen": "images/menemen.jpg",
  "Mıhlama": "images/mıhlama.jpg",
  "Yumurtalı Ekmek": "images/yumurtaliekmek.jpg",
  "Gözleme": "images/gözleme.jpg",
    // Yumurta çeşitleri
  "Sade Yumurta": "images/sadeyumurta.jpg",
  "Sucuklu Yumurta": "images/sucukluyumurta.jpg",
  "Omlet": "images/omlet.jpg",
  "Beyaz Peynirli Yumurta": "images/beyazpeyniromlet.jpg",
  "Kaşar Peynirli Yumurta": "images/kaşarlıomlet.jpg",
    // Tostlar
  "Kaşarlı Tost": "images/kasarlıtost.jpg",
  "Karışık Tost": "images/karısıktost.jpg",
  "Ayvalık Tostu": "images/ayvalikktost.jpg",
  "Akdeniz Tostu": "images/akdenizztostt.jpg",
// Balıklar
"Izgara Somon": "images/somon.jpg",
"Izgara Levrek": "images/levrek.jpg",
"Izgara Çipura": "images/cipura.jpg",
"Mezgit Tava": "images/mezgit.jpg",
"Hamsi Tava": "images/hamsi.jpg",

})[name] || `images/${slugify(name)}.jpg`,

...getProductDetails(name, subcategory.name)
    }))
  )
);

const selectedAllergens = new Set();
let activeCategory = "Tümü";
let activeSubcategory = "";
let searchTerm = "";

const allergenList = document.getElementById("allergenList");
const categoryList = document.getElementById("categoryList");
const subcategoryList = document.getElementById("subcategoryList");
const productList = document.getElementById("productList");
const filterMessage = document.getElementById("filterMessage");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function slugify(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getGroupId(category, subcategory) {
  return `group-${slugify(category)}-${slugify(subcategory)}`;
}

function getSubcategories(category) {
  const group = MENU_DATA.find(item => item.category === category);
  return group ? group.subcategories.map(item => item.name) : [];
}

function renderAllergens() {
  allergenList.innerHTML = ALLERGENS.map(item => `
    <label class="allergen-option">
      <input type="checkbox" value="${item.id}" aria-label="${escapeHTML(item.label)}">
      <span>${escapeHTML(item.label)}</span>
    </label>
  `).join("");

  allergenList.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked) selectedAllergens.add(input.value);
      else selectedAllergens.delete(input.value);
      renderProducts();
    });
  });
}

function renderCategories() {
  categoryList.innerHTML = CATEGORIES.map(category => `
    <button
      type="button"
      class="category-btn ${category === activeCategory ? "active" : ""}"
      data-category="${escapeHTML(category)}"
    >${escapeHTML(category)}</button>
  `).join("");

  categoryList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      activeSubcategory = "";
      renderCategories();
      renderSubcategories();
      renderProducts();
    });
  });
}

function renderSubcategories() {
  if (activeCategory === "Tümü") {
    subcategoryList.innerHTML = "";
    subcategoryList.hidden = true;
    return;
  }

  const subcategories = getSubcategories(activeCategory);
  subcategoryList.hidden = subcategories.length === 0;
  subcategoryList.innerHTML = subcategories.map(subcategory => `
    <button
      type="button"
      class="subcategory-btn ${subcategory === activeSubcategory ? "active" : ""}"
      data-subcategory="${escapeHTML(subcategory)}"
    >${escapeHTML(subcategory)}</button>
  `).join("");

  subcategoryList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeSubcategory = button.dataset.subcategory;
      renderSubcategories();
      renderProducts();

      requestAnimationFrame(() => {
        const target = document.getElementById(
          getGroupId(activeCategory, activeSubcategory)
        );
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });
}


function getVisibleProducts() {
  const query = searchTerm.trim().toLocaleLowerCase("tr-TR");

  return PRODUCTS.filter(product => {
    const containsSelectedAllergen = [...selectedAllergens].some(id =>
      product.allergens.includes(id)
    );

    if (containsSelectedAllergen) return false;

    const matchesCategory =
      activeCategory === "Tümü" || product.category === activeCategory;

    const matchesSubcategory =
      !activeSubcategory || product.subcategory === activeSubcategory;

    const searchableText = [
      product.name,
      product.category,
      product.subcategory,
      product.description
    ].join(" ").toLocaleLowerCase("tr-TR");

    return matchesCategory && matchesSubcategory &&
      (!query || searchableText.includes(query));
  });
}

function renderProductCard(product) {
  return `
    <article
  class="product-card"
  data-product-id="${escapeHTML(product.id)}"
  tabindex="0"
  role="button"
  aria-label="${escapeHTML(product.name)} ayrıntılarını aç"
>
      <div class="product-art">
        <span class="product-emoji" aria-hidden="true">
          ${escapeHTML(product.emoji)}
        </span>

        <img
          class="product-photo"
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.style.display='none';"
        >
      </div>

      <div class="product-content">
        
<div class="product-top">
  <h3 class="product-name">${escapeHTML(product.name)}</h3>
  <span class="product-price">
    ${product.price != null
      ? `${product.price.toLocaleString("tr-TR")} TL`
      : "Fiyat belirtilmedi"}
  </span>
</div>

<p class="product-description">
  ${escapeHTML(product.description || "Ürün açıklaması henüz eklenmedi.")}
</p>


<div class="product-tags">
  <span class="product-tag">
    Olası alerjenler: ${
      product.allergens.length
        ? escapeHTML(
            product.allergens
              .map(id => ALLERGENS.find(a => a.id === id)?.label || id)
              .join(", ")
          )
        : "İçerik bilgisi kontrol edilmelidir"
    }
  </span>

  <span class="product-tag allergen-warning">
    <span aria-hidden="true">ⓘ</span>
    Alerjen bilgisi işletme tarafından doğrulanmalıdır
  </span>
</div>


      </div>
    </article>
  `;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const groups = [];

  visibleProducts.forEach(product => {
    let group = groups.find(item =>
      item.category === product.category &&
      item.subcategory === product.subcategory
    );

    if (!group) {
      group = {
        category: product.category,
        subcategory: product.subcategory,
        products: []
      };
      groups.push(group);
    }

    group.products.push(product);
  });

  productList.innerHTML = groups.map(group => {
    const heading = activeCategory === "Tümü"
      ? `${group.category} · ${group.subcategory}`
      : group.subcategory;

    return `
      <section class="product-group" id="${getGroupId(group.category, group.subcategory)}">
        <div class="product-group-heading">
          <h3>${escapeHTML(heading)}</h3>
          <span>${group.products.length} ürün</span>
        </div>
        <div class="product-grid">
          ${group.products.map(renderProductCard).join("")}
        </div>
      </section>
    `;
  }).join("");

  productList.hidden = visibleProducts.length === 0;
  emptyMessage.hidden = visibleProducts.length !== 0;
  resultCount.textContent = `${visibleProducts.length} ürün`;

  if (selectedAllergens.size > 0) {
    const names = [...selectedAllergens]
      .map(id => ALLERGENS.find(item => item.id === id)?.label)
      .filter(Boolean);

    filterMessage.textContent =
      `${names.join(", ")} seçildi. Alerjen bilgisi doğrulanmamış ürünler gösterilmiyor. ${visibleProducts.length} ürün listelendi.`;
  } else {
    filterMessage.textContent =
      `Henüz alerjen seçilmedi. ${visibleProducts.length} ürün listeleniyor.`;
  }
}

function openProductModal(product) {
  if (!product) return;

  let modal = document.getElementById("productModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "productModal";
    modal.className = "product-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "productModalTitle");
    document.body.appendChild(modal);
  }

  const allergenText = product.allergens.length
    ? product.allergens
        .map(id => ALLERGENS.find(item => item.id === id)?.label || id)
        .join(", ")
    : "İçerik bilgisi işletme tarafından kontrol edilmelidir.";

  modal.innerHTML = `
    <div class="product-modal-content">
      <button
        type="button"
        class="product-modal-close"
        aria-label="Pencereyi kapat"
      >×</button>

      <img
        class="product-modal-image"
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}"
      >

      <div class="product-modal-details">
        <span class="product-modal-category">
          ${escapeHTML(product.category)} · ${escapeHTML(product.subcategory)}
        </span>

        <h2 id="productModalTitle">${escapeHTML(product.name)}</h2>

        <p class="product-modal-price">
          ${product.price != null
            ? `${product.price.toLocaleString("tr-TR")} TL`
            : "Fiyat belirtilmedi"}
        </p>

        <h3>Ürün hakkında</h3>
        <p>${escapeHTML(product.description || "Ürün açıklaması henüz eklenmedi.")}</p>

        <h3>Olası alerjenler</h3>
        <p>${escapeHTML(allergenText)}</p>

        <p class="product-modal-warning">
          ⓘ Alerjen bilgileri işletme tarafından doğrulanmalıdır.
        </p>
      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(".product-modal-close");
  closeButton.focus();

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  closeButton.addEventListener("click", closeModal);

  modal.onclick = event => {
    if (event.target === modal) closeModal();
  };

  modal.onkeydown = event => {
    if (event.key === "Escape") closeModal();
  };

  const modalImage = modal.querySelector(".product-modal-image");
  modalImage.addEventListener("error", () => {
    modalImage.style.display = "none";
  }, { once: true });
}

// Kartlara tıklanınca ürün ayrıntısını aç.
productList.addEventListener("click", event => {
  const card = event.target.closest(".product-card");
  if (!card) return;

  const product = PRODUCTS.find(
    item => item.id === card.dataset.productId
  );

  openProductModal(product);
});

// Klavyeyle de ürün ayrıntısı açılabilsin.
productList.addEventListener("keydown", event => {
  if (event.target.closest("button, a, input, textarea, select")) return;
  if (event.key !== "Enter" && event.key !== " ") return;

  const card = event.target.closest(".product-card");
  if (!card) return;

  event.preventDefault();

  const product = PRODUCTS.find(
    item => item.id === card.dataset.productId
  );

  openProductModal(product);
});

function clearFilters() {
  selectedAllergens.clear();
  searchTerm = "";
  activeCategory = "Tümü";
  activeSubcategory = "";

  allergenList.querySelectorAll("input").forEach(input => {
    input.checked = false;
  });

  searchInput.value = "";
  renderCategories();
  renderSubcategories();
  renderProducts();
}

document.getElementById("clearFilters").addEventListener("click", clearFilters);
document.getElementById("emptyClear").addEventListener("click", clearFilters);

searchInput.addEventListener("input", event => {
  searchTerm = event.target.value;
  renderProducts();
});

function createQRCode() {
  const qrElement = document.getElementById("qrcode");
  const message = document.getElementById("qrMessage");

  if (typeof QRCode === "undefined") {
    message.textContent = "QR kütüphanesi yüklenemedi. İnternet bağlantısını kontrol et.";
    return;
  }

  qrElement.innerHTML = "";

  new QRCode(qrElement, {
    text: window.location.href.split("#")[0],
    width: 180,
    height: 180,
    colorDark: "#20251f",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  message.textContent =
    location.protocol === "file:" ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1"
      ? "Bu yerel bir önizleme. Gerçek QR kodu için siteyi yayınla."
      : "Menü bağlantısının QR kodu hazır.";
}

document.getElementById("downloadQR").addEventListener("click", () => {
  const qrElement = document.getElementById("qrcode");
  const canvas = qrElement.querySelector("canvas");
  const image = qrElement.querySelector("img");

  const dataUrl = canvas
    ? canvas.toDataURL("image/png")
    : image && image.src.startsWith("data:image")
      ? image.src
      : "";

  if (!dataUrl) {
    document.getElementById("qrMessage").textContent =
      "QR kod henüz hazır değil. Sayfayı yenileyip tekrar dene.";
    return;
  }

  const link = document.createElement("a");
  link.download = "aksarayuni-menu-qr.png";
  link.href = dataUrl;
  link.click();
});

renderAllergens();
renderCategories();
renderSubcategories();
renderProducts();

if (document.readyState === "complete") {
  createQRCode();
} else {
  window.addEventListener("load", createQRCode, { once: true });
}
