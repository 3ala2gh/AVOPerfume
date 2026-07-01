import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  I18nContext,
  type I18nContextValue,
  type Language,
  type TranslationValues,
} from "./context/i18n-context";

const LANGUAGE_STORAGE_KEY = "avo_language";

const translations = {
  en: {
    brand: "AVO PERFUME",
    nav: { home: "Home", shop: "Shop", offers: "Offers", cart: "Cart" },
    language: { switchTo: "العربية", label: "Change language" },
    common: {
      addToCart: "Add to Cart",
      backHome: "Back to Home",
      cancel: "Cancel",
      category: "Category",
      clearCart: "Clear Cart",
      closeCart: "Close cart",
      closeModal: "Close modal",
      continueShopping: "Continue Shopping",
      description: "Description",
      email: "Email",
      female: "Female",
      filters: "FILTERS",
      gender: "Gender",
      hide: "Hide",
      image: "Image",
      loadingProducts: "Loading products...",
      male: "Male",
      name: "Name",
      noPerfumes: "No perfumes match your filters.",
      password: "Password",
      remove: "Remove",
      search: "Search",
      show: "Show",
      unisex: "Unisex",
      viewStore: "View Store",
      jod: "JOD",
      sale: "Sale",
      openCart: "Open cart",
      openMenu: "Open menu",
    },
    category: {
      all: "All",
      men: "Men",
      women: "Women",
      floral: "Floral",
      fresh: "Fresh",
      oriental: "Oriental",
      uncategorized: "Uncategorized",
      wood: "Wood",
      woody: "Woody",
    },
    home: {
      heroAlt: "Luxury perfume",
      heroTitle: "TIMELESS LUXURY",
      heroSubtitle: "Discover our exclusive collection of fine fragrances",
      heroCta: "EXPLORE COLLECTION",
      shopByCategory: "SHOP BY CATEGORY",
      fragrances: "{{count}} fragrances",
      moreCategories: "More Categories",
      fewerCategories: "Show Less",
      featuredCollection: "FEATURED COLLECTION",
      perfumesAvailable: "{{count}} perfumes available",
      previousPerfumes: "Show previous perfumes",
      nextPerfumes: "Show next perfumes",
      viewAllPerfumes: "View All Perfumes",
      viewOffers: "View Offers",
      addNamedToCart: "Add {{name}} to cart",
      aboutPremiumTitle: "PREMIUM INGREDIENTS",
      aboutPremiumDescription:
        "Only the finest natural essences from around the world",
      aboutArtisanTitle: "ARTISAN CRAFTED",
      aboutArtisanDescription:
        "Each fragrance is carefully composed by master perfumers",
      aboutLastingTitle: "LASTING IMPRESSION",
      aboutLastingDescription:
        "Long-lasting fragrances that evolve throughout the day",
      footerTagline: "Luxury fragrances crafted with passion and precision",
      footerShop: "SHOP",
      footerSupport: "SUPPORT",
      footerFollow: "FOLLOW US",
      allProducts: "All Products",
      collections: "Collections",
      newArrivals: "New Arrivals",
      bestSellers: "Best Sellers",
      contactUs: "Contact Us",
      shippingInfo: "Shipping Info",
      returns: "Returns",
      faq: "FAQ",
      copyright: "© 2026 AVO PERFUMES. All rights reserved.",
      stayConnected: "STAY CONNECTED",
      stayConnectedText:
        "Subscribe to receive exclusive offers and new collection updates",
      emailPlaceholder: "Your email address",
      subscribe: "SUBSCRIBE",
    },
    shop: {
      title: "ALL PERFUMES",
      subtitle: "Explore our complete collection",
      search: "SEARCH",
      searchPlaceholder: "Search...",
      searchPerfumesPlaceholder: "Search perfumes...",
      typePerfumePlaceholder: "Type perfume name...",
      chooseCategory: "Choose a category",
      sortBy: "SORT BY",
      sortName: "Name (A-Z)",
      sortPriceLow: "Price (Low to High)",
      sortPriceHigh: "Price (High to Low)",
      resetFilters: "RESET FILTERS",
      showingPerfumes: "Showing {{count}} perfumes",
    },
    offers: {
      title: "OFFERS",
      subtitle: "Explore our latest deals",
      empty: "No offers yet. Please check again soon.",
      imageAlt: "Offer {{number}}",
      previous: "Previous offer",
      next: "Next offer",
    },
    cart: {
      title: "Your Cart",
      subtitle:
        "Review your selected perfumes and send your order on WhatsApp.",
      empty: "Your cart is empty.",
      browse: "Browse perfumes",
      sendWhatsApp: "Send Order On WhatsApp",
      helper:
        'Clicking "Send Order On WhatsApp" opens WhatsApp chat with your selected perfumes and total amount prefilled in the message.',
      itemPrice: "{{price}} JOD x {{quantity}}",
      added: "{{name}} {{size}} added to cart",
      whatsappGreeting: "Hello AVO Perfume, I would like to order:",
      whatsappTotal: "Total Amount: {{total}} JOD",
      whatsappThanks: "Thank you.",
      whatsappError:
        "Could not open WhatsApp. Please allow popups and try again.",
    },
    details: {
      loading: "Loading perfume...",
      notFoundTitle: "Perfume Not Found",
      notFoundText: "We could not find a perfume with this name.",
    },
    products: {
      title: "Products",
      subtitle: "Products are loaded from your database.",
    },
    notFound: {
      title: "404",
      text: "Page not found.",
    },
    admin: {
      loginTitle: "Admin Login",
      loginSubtitle: "Sign in as admin to access dashboard routes.",
      login: "Login",
      loggingIn: "Logging in...",
      productsDashboard: "Admin Dashboard - Products",
      offersDashboard: "Admin Dashboard - Offers",
      products: "Products",
      offers: "Offers",
      logout: "Logout",
      publishWebsite: "Publish Website",
      publishing: "Publishing...",
      addPerfume: "Add Perfume",
      createPerfume: "Create Perfume",
      creating: "Creating...",
      selectCategory: "Select category",
      sizePrices: "Size Prices",
      searchEditPerfumes: "Search and Edit Perfumes",
      searchPerfumesPlaceholder:
        "Search by name, category, description, or price",
      loadingPerfumes: "Loading perfumes...",
      noPerfumesSearch: "No perfumes match your search.",
      editPerfume: "Edit Perfume",
      editNamedPerfume: "Edit {{name}}",
      replaceImage: "Replace Image (optional)",
      saveChanges: "Save Changes",
      saving: "Saving...",
      deletePerfume: "Delete Perfume",
      deleting: "Deleting...",
      addCategory: "Add Category",
      categoryName: "Category name",
      categoryNameEnglish: "English category name",
      categoryNameArabic: "Arabic category name",
      categoryNamesRequired: "English and Arabic category names are required.",
      manageCategories: "Manage Categories",
      editCategory: "Edit",
      deleteCategory: "Delete",
      loadingCategories: "Loading categories...",
      categoryCreated: "Category created successfully.",
      categoryUpdated: "Category updated successfully.",
      categoryDeleted: "Category deleted successfully.",
      categorySaveError: "Unable to save category. The English name may already exist.",
      categoryDeleteInUse: "This category cannot be deleted while perfumes use it.",
      deleteCategoryConfirm: 'Delete category "{{name}}"?',
      add: "Add",
      adding: "Adding...",
      uploadOfferImage: "Upload Offer Image",
      uploading: "Uploading...",
      loadingOffers: "Loading offers...",
      noOffersUploaded: "No offer images uploaded yet.",
      offerRemoved: "Offer removed successfully.",
      offerUploaded: "Offer uploaded successfully.",
      perfumeCreated: "Perfume created successfully.",
      perfumeUpdated: "Perfume updated successfully.",
      perfumeDeleted: "Perfume deleted successfully.",
      publishTriggered: "Website publish triggered successfully.",
      updateError: "Unable to update perfume right now.",
      deleteError: "Unable to delete perfume right now.",
      createError: "Unable to create perfume right now.",
      offerRemoveError: "Unable to remove offer right now.",
      offerUploadError: "Unable to upload offer right now.",
      publishError: "Unable to trigger website publish right now.",
      deleteConfirm:
        'Delete "{{name}}" permanently? This action cannot be undone.',
      nameRequired: "Name is required.",
      categoryRequired: "Category is required.",
      priceRequired: "All size prices must be greater than 0.",
      imageRequired: "Image is required",
    },
  },
  ar: {
    brand: "عطور AVO",
    nav: { home: "الرئيسية", shop: "المتجر", offers: "العروض", cart: "السلة" },
    language: { switchTo: "English", label: "تغيير اللغة" },
    common: {
      addToCart: "أضف إلى السلة",
      backHome: "العودة للرئيسية",
      cancel: "إلغاء",
      category: "الفئة",
      clearCart: "تفريغ السلة",
      closeCart: "إغلاق السلة",
      closeModal: "إغلاق النافذة",
      continueShopping: "متابعة التسوق",
      description: "الوصف",
      email: "البريد الإلكتروني",
      female: "أنثوي",
      filters: "الفلاتر",
      gender: "الجنس",
      hide: "إخفاء",
      image: "الصورة",
      loadingProducts: "جاري تحميل المنتجات...",
      male: "رجالي",
      name: "الاسم",
      noPerfumes: "لا توجد عطور مطابقة للفلاتر.",
      password: "كلمة المرور",
      remove: "حذف",
      search: "بحث",
      show: "إظهار",
      unisex: "للجنسين",
      viewStore: "عرض المتجر",
      jod: "د.أ",
      sale: "خصم",
      openCart: "فتح السلة",
      openMenu: "فتح القائمة",
    },
    category: {
      all: "الكل",
      men: "رجالي",
      women: "نسائي",
      floral: "زهري",
      fresh: "منعش",
      oriental: "شرقي",
      uncategorized: "غير مصنف",
      wood: "خشبي",
      woody: "خشبي",
    },
    home: {
      heroAlt: "عطر فاخر",
      heroTitle: "فخامة خالدة",
      heroSubtitle: "اكتشف مجموعتنا الحصرية من العطور الراقية",
      heroCta: "استكشف المجموعة",
      shopByCategory: "تسوق حسب الفئة",
      fragrances: "{{count}} عطر",
      moreCategories: "المزيد من الفئات",
      fewerCategories: "عرض أقل",
      featuredCollection: "المجموعة المميزة",
      perfumesAvailable: "{{count}} عطر متوفر",
      previousPerfumes: "عرض العطور السابقة",
      nextPerfumes: "عرض العطور التالية",
      viewAllPerfumes: "عرض كل العطور",
      viewOffers: "عرض العروض",
      addNamedToCart: "أضف {{name}} إلى السلة",
      aboutPremiumTitle: "مكونات فاخرة",
      aboutPremiumDescription: "أجود الخلاصات الطبيعية من حول العالم",
      aboutArtisanTitle: "صناعة حرفية",
      aboutArtisanDescription: "كل عطر يُركّب بعناية على يد خبراء العطور",
      aboutLastingTitle: "انطباع يدوم",
      aboutLastingDescription: "عطور طويلة الثبات تتطور رائحتها طوال اليوم",
      footerTagline: "عطور فاخرة صُنعت بشغف ودقة",
      footerShop: "المتجر",
      footerSupport: "الدعم",
      footerFollow: "تابعنا",
      allProducts: "كل المنتجات",
      collections: "المجموعات",
      newArrivals: "وصل حديثاً",
      bestSellers: "الأكثر مبيعاً",
      contactUs: "اتصل بنا",
      shippingInfo: "معلومات الشحن",
      returns: "الإرجاع",
      faq: "الأسئلة الشائعة",
      copyright: "© 2026 عطور AVO. جميع الحقوق محفوظة.",
      stayConnected: "ابقَ على تواصل",
      stayConnectedText:
        "اشترك لتصلك العروض الحصرية وتحديثات المجموعات الجديدة",
      emailPlaceholder: "بريدك الإلكتروني",
      subscribe: "اشترك",
    },
    shop: {
      title: "كل العطور",
      subtitle: "استكشف مجموعتنا الكاملة",
      search: "البحث",
      searchPlaceholder: "ابحث...",
      searchPerfumesPlaceholder: "ابحث عن العطور...",
      typePerfumePlaceholder: "اكتب اسم العطر...",
      chooseCategory: "اختر فئة",
      sortBy: "الترتيب حسب",
      sortName: "الاسم (أ-ي)",
      sortPriceLow: "السعر من الأقل للأعلى",
      sortPriceHigh: "السعر من الأعلى للأقل",
      resetFilters: "إعادة ضبط الفلاتر",
      showingPerfumes: "عرض {{count}} عطر",
    },
    offers: {
      title: "العروض",
      subtitle: "اكتشف أحدث عروضنا",
      empty: "لا توجد عروض حالياً. يرجى التحقق لاحقاً.",
      imageAlt: "عرض {{number}}",
      previous: "العرض السابق",
      next: "العرض التالي",
    },
    cart: {
      title: "سلتك",
      subtitle: "راجع العطور المختارة وأرسل طلبك عبر واتساب.",
      empty: "سلتك فارغة.",
      browse: "تصفح العطور",
      sendWhatsApp: "إرسال الطلب عبر واتساب",
      helper:
        'عند الضغط على "إرسال الطلب عبر واتساب" سيتم فتح محادثة واتساب تحتوي تفاصيل طلبك والمجموع.',
      itemPrice: "{{price}} د.أ × {{quantity}}",
      added: "تمت إضافة {{name}} {{size}} إلى السلة",
      whatsappGreeting: "مرحباً AVO Perfume، أود طلب:",
      whatsappTotal: "المجموع: {{total}} د.أ",
      whatsappThanks: "شكراً لكم.",
      whatsappError:
        "تعذر فتح واتساب. يرجى السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.",
    },
    details: {
      loading: "جاري تحميل العطر...",
      notFoundTitle: "العطر غير موجود",
      notFoundText: "لم نتمكن من العثور على عطر بهذا الاسم.",
    },
    products: {
      title: "المنتجات",
      subtitle: "يتم تحميل المنتجات من قاعدة البيانات.",
    },
    notFound: {
      title: "404",
      text: "الصفحة غير موجودة.",
    },
    admin: {
      loginTitle: "تسجيل دخول الإدارة",
      loginSubtitle: "سجّل الدخول كمدير للوصول إلى لوحة التحكم.",
      login: "دخول",
      loggingIn: "جاري الدخول...",
      productsDashboard: "لوحة الإدارة - المنتجات",
      offersDashboard: "لوحة الإدارة - العروض",
      products: "المنتجات",
      offers: "العروض",
      logout: "تسجيل الخروج",
      publishWebsite: "نشر الموقع",
      publishing: "جاري النشر...",
      addPerfume: "إضافة عطر",
      createPerfume: "إنشاء العطر",
      creating: "جاري الإنشاء...",
      selectCategory: "اختر الفئة",
      sizePrices: "أسعار الأحجام",
      searchEditPerfumes: "بحث وتعديل العطور",
      searchPerfumesPlaceholder: "ابحث بالاسم أو الفئة أو الوصف أو السعر",
      loadingPerfumes: "جاري تحميل العطور...",
      noPerfumesSearch: "لا توجد عطور مطابقة للبحث.",
      editPerfume: "تعديل العطر",
      editNamedPerfume: "تعديل {{name}}",
      replaceImage: "استبدال الصورة (اختياري)",
      saveChanges: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      deletePerfume: "حذف العطر",
      deleting: "جاري الحذف...",
      addCategory: "إضافة فئة",
      categoryName: "اسم الفئة",
      categoryNameEnglish: "اسم الفئة بالإنجليزية",
      categoryNameArabic: "اسم الفئة بالعربية",
      categoryNamesRequired: "اسم الفئة بالإنجليزية والعربية مطلوبان.",
      manageCategories: "إدارة الفئات",
      editCategory: "تعديل",
      deleteCategory: "حذف",
      loadingCategories: "جاري تحميل الفئات...",
      categoryCreated: "تم إنشاء الفئة بنجاح.",
      categoryUpdated: "تم تحديث الفئة بنجاح.",
      categoryDeleted: "تم حذف الفئة بنجاح.",
      categorySaveError: "تعذر حفظ الفئة. قد يكون الاسم الإنجليزي مستخدماً.",
      categoryDeleteInUse: "لا يمكن حذف الفئة أثناء استخدامها في عطور.",
      deleteCategoryConfirm: 'حذف الفئة "{{name}}"؟',
      add: "إضافة",
      adding: "جاري الإضافة...",
      uploadOfferImage: "رفع صورة عرض",
      uploading: "جاري الرفع...",
      loadingOffers: "جاري تحميل العروض...",
      noOffersUploaded: "لم يتم رفع صور عروض بعد.",
      offerRemoved: "تم حذف العرض بنجاح.",
      offerUploaded: "تم رفع العرض بنجاح.",
      perfumeCreated: "تم إنشاء العطر بنجاح.",
      perfumeUpdated: "تم تحديث العطر بنجاح.",
      perfumeDeleted: "تم حذف العطر بنجاح.",
      publishTriggered: "تم تشغيل نشر الموقع بنجاح.",
      updateError: "تعذر تحديث العطر حالياً.",
      deleteError: "تعذر حذف العطر حالياً.",
      createError: "تعذر إنشاء العطر حالياً.",
      offerRemoveError: "تعذر حذف العرض حالياً.",
      offerUploadError: "تعذر رفع العرض حالياً.",
      publishError: "تعذر تشغيل نشر الموقع حالياً.",
      deleteConfirm: 'حذف "{{name}}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      nameRequired: "الاسم مطلوب.",
      categoryRequired: "الفئة مطلوبة.",
      priceRequired: "يجب أن تكون جميع أسعار الأحجام أكبر من 0.",
      imageRequired: "الصورة مطلوبة",
    },
  },
} as const;

type TranslationKey = keyof typeof translations.en | string;

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "ar"
    ? "ar"
    : "en";
}

function resolveTranslation(language: Language, key: string): string {
  const parts = key.split(".");
  let current: unknown = translations[language];

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return key;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : key;
}

function interpolate(template: string, values: TranslationValues = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    String(values[name] ?? ""),
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [direction, language]);

  const value = useMemo<I18nContextValue>(() => {
    function setLanguage(nextLanguage: Language) {
      setLanguageState(nextLanguage);
    }

    function t(key: TranslationKey, values?: TranslationValues) {
      return interpolate(resolveTranslation(language, key), values);
    }

    function categoryLabel(category: string, categoryAr?: string) {
      if (language === "ar" && categoryAr?.trim()) {
        return categoryAr;
      }

      const translationKey = `category.${category.trim().toLowerCase()}`;
      return resolveTranslation(language, translationKey) === translationKey
        ? category
        : resolveTranslation(language, translationKey);
    }

    function genderLabel(gender: string) {
      if (gender === "male") return t("common.male");
      if (gender === "female") return t("common.female");
      if (gender === "unisex") return t("common.unisex");
      return gender;
    }

    return {
      language,
      direction,
      isArabic: language === "ar",
      setLanguage,
      toggleLanguage: () => setLanguage(language === "ar" ? "en" : "ar"),
      t,
      categoryLabel,
      genderLabel,
    };
  }, [direction, language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
