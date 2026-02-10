import {
  PrismaClient,
  UserRole,
  UserStatus,
  FranchiseStatus,
  Category,
  MessageStatus
} from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.franchiseCharacteristic.deleteMany();
  await prisma.franchiseStat.deleteMany();
  await prisma.investmentDetails.deleteMany();
  await prisma.franchise.deleteMany();
  await prisma.adminLog.deleteMany();
  await prisma.config.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create Admin
  const adminPassword = await bcrypt.hash('AdminPass123!', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@franchisegate.com',
      password: adminPassword,
      name: 'System Admin',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    }
  });
  console.log('✅ Created admin:', admin.email);

  // Create Franchise Owners
  const ownerPassword = await bcrypt.hash('OwnerPass123!', 12);

  const owners = [
    {
      email: 'owner1@example.com',
      name: 'Mohammed Al-Rashid',
      phone: '+966501234567',
      franchise: {
        name: 'Al-Nadeg',
        tagline: 'فخور بتقديم أطعم أكل سعودي',
        description: 'مطاعم الندى - وجبات سريعة سعودية. نتخصص في تقديم وجبات شاورما وفلافل عالية الجودة.',
        category: Category.RESTAURANTS,
        country: 'Saudi Arabia',
        city: 'Riyadh',
        status: FranchiseStatus.PUBLISHED,
        publishedAt: new Date(),
        views: 342,
        messageCount: 12
      }
    },
    {
      email: 'owner2@example.com',
      name: 'Ahmed Hassan',
      phone: '+966502345678',
      franchise: {
        name: 'Shawarma House',
        tagline: 'الطعم الأصلي للشاورما',
        description: 'أفضل شاورما في المملكة العربية السعودية',
        category: Category.RESTAURANTS,
        country: 'Saudi Arabia',
        city: 'Jeddah',
        status: FranchiseStatus.PUBLISHED,
        publishedAt: new Date(),
        views: 156,
        messageCount: 8
      }
    },
    {
      email: 'owner3@example.com',
      name: 'Khalid Al-Farsi',
      phone: '+971501234567',
      franchise: {
        name: 'Falafel Kingdom',
        tagline: 'ملك الفلافل في الخليج',
        description: 'فلافل سورية أصيلة مع لمسة عصرية',
        category: Category.RESTAURANTS,
        country: 'UAE',
        city: 'Dubai',
        status: FranchiseStatus.PENDING,
        views: 0,
        messageCount: 0
      }
    },
    {
      email: 'owner4@example.com',
      name: 'Sami Al-Otaibi',
      phone: '+966503456789',
      franchise: {
        name: 'Burger Station',
        tagline: 'برجر بلمسة سعودية',
        description: 'برجر عصري بطعم سعودي أصيل',
        category: Category.RESTAURANTS,
        country: 'Saudi Arabia',
        city: 'Dammam',
        status: FranchiseStatus.DRAFT,
        views: 0,
        messageCount: 0
      }
    }
  ];

  for (const ownerData of owners) {
    const { franchise: franchiseData, ...userData } = ownerData;

    const owner = await prisma.user.create({
      data: {
        ...userData,
        password: ownerPassword,
        role: UserRole.FRANCHISE_OWNER,
        status: UserStatus.ACTIVE,
        franchise: {
          create: {
            ...franchiseData,
            slug: franchiseData.name.toLowerCase().replace(/\s+/g, '-'),
            investment: {
              create: {
                minInvestment: 50000,
                maxInvestment: 150000,
                franchiseFee: 200000,
                franchiseFeeLocal: 'SAR',
                franchiseFeeIntl: 50000,
                royaltyFee: '4% - 3%',
                marketingFee: '1%',
                equipmentCost: 700000,
                equipmentCurrency: 'SAR'
              }
            }
          }
        }
      },
      include: {
        franchise: {
          include: {
            investment: true
          }
        }
      }
    });

    console.log('✅ Created owner:', owner.email, '- Franchise:', owner.franchise.name);

    // Add stats
    const stats = [
      { label: 'المساحة المطلوبة', value: '400-600', subtext: 'Sq. M.', icon: 'maximize', order: 0 },
      { label: 'عدد الفروع', value: '21', suffix: '+', icon: 'building', order: 1 },
      { label: 'عدد الموظفين', value: '40', subtext: 'Employees', icon: 'users', order: 2 },
      { label: 'مدة التدريب', value: '2-4', subtext: 'weeks', icon: 'clock', order: 3 },
      { label: 'سنة التأسيس', value: '2002', icon: 'calendar', order: 4 },
      { label: 'تكلفة المعدات', value: '700,000', subtext: 'SAR', icon: 'dollar', order: 5 },
      { label: 'مدة العقد', value: '5', subtext: 'years', icon: 'file', order: 6 },
      { label: 'الفرع الرئيسي', value: 'Riyadh', icon: 'map', order: 7 }
    ];

    await prisma.franchiseStat.createMany({
      data: stats.map(stat => ({
        ...stat,
        franchiseId: owner.franchise.id
      }))
    });

    // Add characteristics
    const characteristics = [
      {
        title: 'نسبة حقوق الامتياز',
        items: [
          '200,000 Saudi Riyals Per Outlet Local (KSA) Development',
          'US$ 50,000 Per Outlet (Regional / Intl. Development)'
        ],
        order: 0
      },
      {
        title: 'نسبة التسويق',
        value: '1%',
        items: [],
        order: 1
      },
      {
        title: 'Investments Cost',
        value: '1,500,000$',
        items: [],
        order: 2
      },
      {
        title: 'Royalty Fees',
        value: '4% - 3%',
        items: [],
        order: 3
      }
    ];

    await prisma.franchiseCharacteristic.createMany({
      data: characteristics.map(char => ({
        ...char,
        franchiseId: owner.franchise.id
      }))
    });

    // Add gallery images (placeholder URLs)
    const images = [
      { url: '/image-1.jpg', alt: 'Interior', order: 0 },
      { url: '/image-2.jpg', alt: 'Food', order: 1 },
      { url: '/image-3.jpg', alt: 'Seating', order: 2 },
      { url: '/image-4.jpg', alt: 'Exterior', order: 3 }
    ];

    await prisma.galleryImage.createMany({
      data: images.map(img => ({
        ...img,
        franchiseId: owner.franchise.id
      }))
    });
  }

  // Create pending owner (needs approval)
  const pendingOwner = await prisma.user.create({
    data: {
      email: 'pending@example.com',
      password: ownerPassword,
      name: 'Pending Owner',
      phone: '+966504567890',
      role: UserRole.FRANCHISE_OWNER,
      status: UserStatus.PENDING
    }
  });
  console.log('✅ Created pending owner:', pendingOwner.email);

  // Create sample messages for first franchise
  const firstFranchise = await prisma.franchise.findFirst({
    where: { name: 'Al-Nadeg' }
  });

  if (firstFranchise) {
    const messages = [
      {
        senderName: 'Abdullah Al-Saud',
        senderEmail: 'abdullah@example.com',
        senderPhone: '+966505678901',
        subject: 'Interest in Jeddah franchise',
        content: 'I am interested in opening an Al-Nadeg franchise in Jeddah. Please send me more information about the requirements and investment details.',
        franchiseId: firstFranchise.id,
        ownerId: firstFranchise.ownerId,
        status: MessageStatus.UNREAD
      },
      {
        senderName: 'Faisal Bin Ahmed',
        senderEmail: 'faisal@example.com',
        senderPhone: '+966506789012',
        subject: 'Multi-unit franchise inquiry',
        content: 'I want to discuss the possibility of opening multiple Al-Nadeg locations in the Eastern Province. Can we schedule a call?',
        franchiseId: firstFranchise.id,
        ownerId: firstFranchise.ownerId,
        status: MessageStatus.READ,
        readAt: new Date()
      }
    ];

    await prisma.message.createMany({ data: messages });
    console.log('✅ Created sample messages');
  }

  console.log('\n🎉 Database seed completed!');
  console.log('\nLogin credentials:');
  console.log('  Admin: admin@franchisegate.com / AdminPass123!');
  console.log('  Owner: owner1@example.com / OwnerPass123!');
  console.log('  Pending: pending@example.com / OwnerPass123!');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
