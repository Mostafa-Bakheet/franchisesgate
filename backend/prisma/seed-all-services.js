import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All 12 services data from old system
const allServices = [
  {
    title: 'فحص العلامات التجارية',
    items: [
      'تحليل علامة المالك',
      'تسجيل علامة تجارية',
      'هندسة صنيو رقمية',
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1 (1).png',
    subtitle: 'مدرسة إسناد صغير',
    price: 2500,
  },
  {
    title: 'التسويق لمانح الامتياز',
    items: [
      'الإدارة الأولى رقمي لتجربة العملاء',
      'هندسة صنيو رقمي للامتياز',
      'الإدارة الثالثة علامات وجهات تجمع',
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1 (1).png',
    subtitle: 'أرقى منصات فعاليات',
    price: 5000,
  },
  {
    title: 'منظومة الامتياز الاحترافية',
    items: [
      'بناء الامتياز الجازي',
      'العقود عبر المنصة',
      'الاستشارات عن بعد',
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1 (1).png',
    subtitle: 'صناديق جاهز للتوسع',
    price: 15000,
  },
  {
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
    price: 25000,
  },
  {
    title: 'الباقة البروزنية المتكاملة',
    items: [
      'إعداد أنظمة الامتياز',
      'هندسة صنيو إدراجية',
      'الدليل المهندس الشامل',
    ],
    image: '/Whisk_eb9871ddd436a82888942a2198d98751dr (1) 1.png',
    subtitle: 'إسناد صنيو عبدالله',
    price: 12000,
  },
  {
    title: 'الباقة الفضية المتكاملة',
    items: [
      'إعداد أنظمة الامتياز',
      'هندسة صنيو إدراجية',
    ],
    image: '/Whisk_d225b041da8f15a85184a40183e98912dr 1.png',
    subtitle: 'نظام تواريخ وتواريخ',
    price: 8000,
  },
  {
    title: 'البرمجة وتقنية المعلومات',
    items: [
      'تصميم وبرامج الوظايفة',
      'تصميم تطبيقات كويتة',
      'تصميم ERP متكاملة',
    ],
    image: '/Whisk_7e5388ce7aa848291cd41ff9241bb3bcdr 1.png',
    subtitle: 'حلول برمجية متكاملة',
    price: 20000,
  },
  {
    title: 'الإدارة الفنية المتكاملة',
    items: [
      'إعداد تواريخ دخول',
      'توجيه تشريح دخولية',
      'إعداد برامج عددانية',
    ],
    image: '/Whisk_a84330f3ac8a0faba4741cc2d7dd35fddr 1.png',
    subtitle: 'أنظمة منهاج ومناهج',
    price: 10000,
  },
  {
    title: 'أعمال إنشاء وتشطيب',
    items: [
      'التشغيل الودي للمنصات',
      'تشغيل الدليل الودي',
    ],
    image: '/Whisk_cfd1f190ee2b8aca62d4337fe7395802dr 1.png',
    subtitle: 'التشغيل الودي الودي',
    price: 35000,
  },
  {
    title: 'البرمجة وتقنية المعلومات - الباقة الثانية',
    items: [
      'تصميم وبرامج الوظايفة',
      'تصميم تطبيقات كويتة',
      'تصميم ERP متكاملة',
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1 (2).png',
    subtitle: 'حلول برمجية متكاملة',
    price: 25000,
  },
  {
    title: 'الإدارة الفنية المتكاملة - الباقة الثانية',
    items: [
      'إعداد تواريخ دخول',
      'توجيه تشريح دخولية',
      'إعداد برامج عددانية',
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1 (2).png',
    subtitle: 'أنظمة منهاج ومناهج',
    price: 12000,
  },
  {
    title: 'فرص استثمار مطاعم',
    items: [
      'عروض ومنصات مستثمرين',
      'خطط إن اسناد',
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1 (2).png',
    subtitle: 'استثمار إفرادي مستثمر',
    price: 5000,
  },
];

// Helper to create unique slug - simple service-X format
function createSlug(index) {
  return `service-${index + 1}`;
}

async function resetAndSeedServices() {
  console.log('🗑️ Deleting all existing services...');
  
  // First delete all order items (because of foreign key constraints)
  await prisma.serviceOrderItem.deleteMany({});
  
  // Then delete all orders
  await prisma.serviceOrder.deleteMany({});
  
  // Finally delete all services
  await prisma.service.deleteMany({});
  
  console.log('✅ Deleted all existing services');
  console.log('🚀 Starting to seed all 12 services...\n');

  // Track duplicates to create unique slugs
  const titleCount = {};

  for (let i = 0; i < allServices.length; i++) {
    const svc = allServices[i];
    const titleKey = svc.title.replace(/ - الباقة الثانية$/, '');
    
    if (!titleCount[titleKey]) {
      titleCount[titleKey] = 0;
    }
    const index = titleCount[titleKey];
    titleCount[titleKey]++;
    
    const slug = createSlug(svc.title, index);
    
    const serviceData = {
      name: svc.title,
      slug: slug,
      description: `${svc.subtitle}. يشمل الخدمة: ${svc.items.join('، ')}`,
      shortDesc: svc.subtitle,
      price: svc.price,
      oldPrice: null,
      icon: null,
      image: svc.image,
      bgColor: '#FFFFFF',
      order: i + 1,
      isActive: true,
      features: svc.items,
    };

    await prisma.service.create({ data: serviceData });

    console.log(`✅ ${i + 1}. ${svc.title} - ${svc.price} ر.س`);
  }

  console.log('\n🎉 Successfully created all 12 services!');
  
  // Verify count
  const count = await prisma.service.count();
  console.log(`📊 Total services in database: ${count}`);
}

resetAndSeedServices()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
