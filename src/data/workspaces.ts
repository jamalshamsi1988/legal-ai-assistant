export interface Workspace {
  slug: string;
  name_fa: string;
  description: string;
  icon: string; // lucide icon name
}

export const WORKSPACES: Workspace[] = [
  { slug: "civil", name_fa: "حقوق مدنی", description: "قراردادها، تعهدات، ضمان، مالکیت", icon: "Scale" },
  { slug: "criminal", name_fa: "حقوق کیفری", description: "جرایم، مجازات‌ها، آیین دادرسی کیفری", icon: "Gavel" },
  { slug: "family", name_fa: "حقوق خانواده", description: "ازدواج، طلاق، مهریه، نفقه، حضانت", icon: "Users" },
  { slug: "labor", name_fa: "حقوق کار", description: "قرارداد کار، اخراج، بیمه، حق سنوات", icon: "Briefcase" },
  { slug: "commerce", name_fa: "حقوق تجارت", description: "شرکت‌ها، چک، برات، ورشکستگی", icon: "Building2" },
  { slug: "real-estate", name_fa: "املاک و مستغلات", description: "اجاره، خرید و فروش، سرقفلی، رهن", icon: "Home" },
  { slug: "tax", name_fa: "حقوق مالیاتی", description: "مالیات بر درآمد، ارزش افزوده، اعتراضات", icon: "Receipt" },
  { slug: "banking", name_fa: "حقوق بانکی", description: "تسهیلات، چک برگشتی، ضمانت‌نامه", icon: "Landmark" },
  { slug: "insurance", name_fa: "حقوق بیمه", description: "بیمه شخص ثالث، عمر، درمان، اموال", icon: "ShieldCheck" },
  { slug: "traffic", name_fa: "تخلفات رانندگی", description: "تصادفات، خسارات، گواهینامه، جرایم", icon: "Car" },
  { slug: "consumer", name_fa: "حقوق مصرف‌کننده", description: "تضمین کالا، خدمات معیوب، تخلفات صنفی", icon: "ShoppingCart" },
  { slug: "ip", name_fa: "مالکیت فکری", description: "ثبت اختراع، علامت تجاری، حق مؤلف", icon: "Lightbulb" },
  { slug: "cyber", name_fa: "جرایم سایبری", description: "هک، کلاهبرداری اینترنتی، نشر اکاذیب", icon: "Cpu" },
  { slug: "media", name_fa: "حقوق رسانه", description: "افترا، توهین، نشر محتوا، مطبوعات", icon: "Newspaper" },
  { slug: "administrative", name_fa: "حقوق اداری", description: "دیوان عدالت، استخدام، انفصال، بازنشستگی", icon: "FileText" },
  { slug: "military", name_fa: "حقوق نظامی", description: "خدمت سربازی، معافیت، دادگاه نظامی", icon: "Shield" },
  { slug: "medical", name_fa: "حقوق پزشکی", description: "قصور پزشکی، رضایت‌نامه، نظام پزشکی", icon: "Stethoscope" },
  { slug: "environment", name_fa: "حقوق محیط زیست", description: "آلودگی، شکار، منابع طبیعی", icon: "TreePine" },
  { slug: "land", name_fa: "اراضی و منابع طبیعی", description: "زمین‌های ملی، موات، اراضی کشاورزی", icon: "Mountain" },
  { slug: "construction", name_fa: "حقوق ساخت و ساز", description: "پروانه، کمیسیون ماده ۱۰۰، نظام مهندسی", icon: "HardHat" },
  { slug: "inheritance", name_fa: "ارث و وصیت", description: "تقسیم ترکه، انحصار وراثت، وصیت‌نامه", icon: "ScrollText" },
  { slug: "endowment", name_fa: "وقف و امور خیریه", description: "موقوفات، متولی، نظارت بر وقف", icon: "Heart" },
  { slug: "immigration", name_fa: "حقوق اتباع و مهاجرت", description: "اقامت، تابعیت، اخراج، پناهندگی", icon: "Globe2" },
  { slug: "international", name_fa: "حقوق بین‌الملل خصوصی", description: "اختلافات بین‌المللی، قراردادهای خارجی", icon: "Globe" },
  { slug: "arbitration", name_fa: "داوری و میانجی‌گری", description: "داوری داخلی و بین‌المللی، صلح و سازش", icon: "Handshake" },
  { slug: "execution", name_fa: "اجرای احکام", description: "اجرای حکم مدنی و کیفری، توقیف اموال", icon: "Hammer" },
  { slug: "notary", name_fa: "اسناد و دفاتر اسناد رسمی", description: "تنظیم سند، وکالت‌نامه، تعهدنامه", icon: "Stamp" },
  { slug: "registry", name_fa: "ثبت اسناد و املاک", description: "سند مالکیت، افراز، تفکیک، ثبت نام", icon: "BookMarked" },
  { slug: "transport", name_fa: "حقوق حمل و نقل", description: "بارنامه، خسارت بار، کنوانسیون‌های حمل", icon: "Truck" },
  { slug: "energy", name_fa: "حقوق انرژی", description: "نفت، گاز، برق، انرژی‌های تجدیدپذیر", icon: "Zap" },
  { slug: "mining", name_fa: "حقوق معادن", description: "پروانه بهره‌برداری، حقوق دولتی معدن", icon: "Pickaxe" },
  { slug: "agriculture", name_fa: "حقوق کشاورزی", description: "آب، اراضی زراعی، تعاونی‌های کشاورزی", icon: "Wheat" },
  { slug: "competition", name_fa: "حقوق رقابت", description: "انحصار، رقابت ناسالم، شورای رقابت", icon: "TrendingUp" },
  { slug: "capital-market", name_fa: "بازار سرمایه", description: "بورس، اوراق بهادار، سبدگردانی", icon: "BarChart3" },
  { slug: "crypto", name_fa: "ارز دیجیتال و فین‌تک", description: "رمزارز، استخراج، صرافی، NFT", icon: "Bitcoin" },
  { slug: "data-privacy", name_fa: "حریم خصوصی و داده", description: "حفاظت از داده، نقض حریم، رضایت کاربر", icon: "Lock" },
  { slug: "sports", name_fa: "حقوق ورزش", description: "قرارداد بازیکن، دوپینگ، کمیته انضباطی", icon: "Trophy" },
  { slug: "education", name_fa: "حقوق آموزش", description: "اخراج دانشجو، شهریه، تخلفات صنفی", icon: "GraduationCap" },
  { slug: "human-rights", name_fa: "حقوق بشر", description: "آزادی‌های اساسی، حقوق شهروندی", icon: "HandHeart" },
  { slug: "general", name_fa: "مشاوره عمومی حقوقی", description: "هر سوال حقوقی که در دسته‌های دیگر نمی‌گنجد", icon: "HelpCircle" },
];

export const getWorkspace = (slug: string) =>
  WORKSPACES.find((w) => w.slug === slug);
