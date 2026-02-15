import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Old services data
const oldServices = [
  {
    id: 1,
    title: 'فحص العلامات التجارية',
    items: [
      'تحليل علامة المالك',
      'تسجيل علامة تجارية',
      'هندسة صنيو رقمية',
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1 (1).png',
    subtitle: 'مدرسة إسناد صغير',
  },
  {
    id: 2,
    title: 'التسويق لمانح الامتياز',
    items: [
      'الإدارة الأولى رقمي لتجربة العملاء',
      'هندسة صنيو رقمي للامتياز',
      'الإدارة الثالثة علامات وجهات تجمع',
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1 (1).png',
    subtitle: 'أرقى منصات فعاليات',
  },
  {
    id: 3,
    title: 'منظومة الامتياز الاحترافية',
    items: [
      'بناء الامتياز الجازي',
      'العقود عبر المنصة',
      'الاستشارات عن بعد',
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1 (1).png',
    subtitle: 'صناديق جاهز للتوسع',
  },
  {
    id: 4,
    title: 'الباقة الذهبية الشاملة',
    items: [
      'القطاع الخاصة للعلامة',
      'وثائق أنشطة تجارية',
      'سجلات منصة تجارية',
      '5 كويتة للمنصة مستمر',
      'دليل دلال منصاتين',
    ],
    image: '/Whisk_0f9636eac3c3778943e41f143ac09a4bdr 1.png',
    subtitle: 'منصة تواريخ إسناد صغير',
  },
  {
    id: 5,
    title: 'الباقة البروزنية المتكاملة',
    items: [
      'إعداد أنظمة الامتياز',
      'هندسة صنيو إدراجية',
      'الدليل المهندس الشامل',
    ],
    image: '/Whisk_eb9871ddd436a82888942a2198d98751dr (1) 1.png',
    subtitle: 'إسناد صنيو عبدالله',
  },
  {
    id: 6,
    title: 'الباقة الفضية المتكاملة',
    items: [
      'إعداد أنظمة الامتياز',
      'هندسة صنيو إدراجية',
    ],
    image: '/Whisk_d225b041da8f15a85184a40183e98912dr 1.png',
    subtitle: 'نظام تواريخ وتواريخ',
  },
  {
    id: 7,
    title: 'البرمجة وتقنية المعلومات',
    items: [
      'تصميم وبرامج الوظايفة',
      'تصميم تطبيقات كويتة',
      'تصميم ERP متكاملة',
    ],
    image: '/Whisk_7e5388ce7aa848291cd41ff9241bb3bcdr 1.png',
    subtitle: 'حلول برمجية متكاملة',
  },
  {
    id: 8,
    title: 'الإدارة الفنية المتكاملة',
    items: [
      'إعداد تواريخ دخول',
      'توجيه تشريح دخولية',
      'إعداد برامج عددانية',
    ],
    image: '/Whisk_a84330f3ac8a0faba4741cc2d7dd35fddr 1.png',
    subtitle: 'أنظمة منهاج ومناهج',
  },
  {
    id: 9,
    title: 'أعمال إنشاء وتشطيب',
    items: [
      'التشغيل الودي للمنصات',
      'تشغيل الدليل الودي',
    ],
    image: '/Whisk_cfd1f190ee2b8aca62d4337fe7395802dr 1.png',
    subtitle: 'التشغيل الودي الودي',
  },
  {
    id: 10,
    title: 'البرمجة وتقنية المعلومات',
    items: [
      'تصميم وبرامج الوظايفة',
      'تصميم تطبيقات كويتة',
      'تصميم ERP متكاملة',
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1 (2).png',
    subtitle: 'حلول برمجية متكاملة',
  },
  {
    id: 11,
    title: 'الإدارة الفنية المتكاملة',
    items: [
      'إعداد تواريخ دخول',
      'توجيه تشريح دخولية',
      'إعداد برامج عددانية',
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1 (2).png',
    subtitle: 'أنظمة منهاج ومناهج',
  },
  {
    id: 12,
    title: 'فرص استثمار مطاعم',
    items: [
      'عروض ومنصات مستثمرين',
      'خطط إن اسناد',
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1 (2).png',
    subtitle: 'استثمار إفرادي مستثمر',
  },
];

// Helper to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// Sample prices based on service complexity
const defaultPrices = {
  'فحص العلامات التجارية': 2500,
  'التسويق لمانح الامتياز': 5000,
  'منظومة الامتياز الاحترافية': 15000,
  'الباقة الذهبية الشاملة': 25000,
  'الباقة البروزنية المتكاملة': 12000,
  'الباقة الفضية المتكاملة': 8000,
  'البرمجة وتقنية المعلومات': 20000,
  'الإدارة الفنية المتكاملة': 10000,
  'أعمال إنشاء وتشطيب': 35000,
  'فرص استثمار مطاعم': 5000,
};

async function seedServices() {
  console.log('🚀 Starting to seed services...');

  for (const oldService of oldServices) {
    const slug = createSlug(oldService.title);
    
    // Check if service already exists
    const existing = await prisma.service.findUnique({
      where: { slug }
    });

    if (existing) {
      console.log(`⚠️ Service "${oldService.title}" already exists, skipping...`);
      continue;
    }

    const serviceData = {
      name: oldService.title,
      slug: slug,
      description: `${oldService.subtitle}. يشمل: ${oldService.items.join(', ')}`,
      shortDesc: oldService.subtitle,
      price: defaultPrices[oldService.title] || 5000,
      oldPrice: null,
      icon: null,
      image: oldService.image,
      bgColor: '#FFFFFF',
      order: oldService.id,
      isActive: true,
      features: oldService.items,
    };

    await prisma.service.create({
      data: serviceData
    });

    console.log(`✅ Created service: ${oldService.title}`);
  }

  console.log('🎉 Services seeding completed!');
}

seedServices()
  .catch((e) => {
    console.error('❌ Error seeding services:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
