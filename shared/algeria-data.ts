export interface WilayaData {
  code: number;
  nameAr: string;
  nameEn: string;
  defaultPrice: number;
  baladiyas: { nameAr: string; nameEn: string }[];
}

export const algerianWilayas: WilayaData[] = [
  { code: 1, nameAr: "أدرار", nameEn: "Adrar", defaultPrice: 900, baladiyas: [
    { nameAr: "أدرار", nameEn: "Adrar" }, { nameAr: "تيميمون", nameEn: "Timimoun" }, { nameAr: "أولف", nameEn: "Aoulef" }, { nameAr: "رقان", nameEn: "Reggane" }, { nameAr: "إن صالح", nameEn: "In Salah" }, { nameAr: "تسابيت", nameEn: "Tsabit" }, { nameAr: "فنوغيل", nameEn: "Fenoughil" }, { nameAr: "زاوية كنتة", nameEn: "Zaouiet Kounta" }, { nameAr: "شروين", nameEn: "Charouine" }, { nameAr: "تامنطيط", nameEn: "Tamentit" }, { nameAr: "بودة", nameEn: "Bouda" }
  ]},
  { code: 2, nameAr: "الشلف", nameEn: "Chlef", defaultPrice: 500, baladiyas: [
    { nameAr: "الشلف", nameEn: "Chlef" }, { nameAr: "تنس", nameEn: "Tenes" }, { nameAr: "الأبيض مجاجة", nameEn: "El Abadia" }, { nameAr: "بوقادير", nameEn: "Boukadir" }, { nameAr: "الكريمية", nameEn: "El Karimia" }, { nameAr: "أولاد فارس", nameEn: "Ouled Fares" }, { nameAr: "عين مران", nameEn: "Ain Merane" }, { nameAr: "واد الفضة", nameEn: "Oued Fodda" }, { nameAr: "أبو الحسن", nameEn: "Abou El Hassan" }, { nameAr: "الحجاج", nameEn: "El Hadjadj" }
  ]},
  { code: 3, nameAr: "الأغواط", nameEn: "Laghouat", defaultPrice: 700, baladiyas: [
    { nameAr: "الأغواط", nameEn: "Laghouat" }, { nameAr: "آفلو", nameEn: "Aflou" }, { nameAr: "حاسي الرمل", nameEn: "Hassi R'Mel" }, { nameAr: "قصر الحيران", nameEn: "Ksar El Hirane" }, { nameAr: "عين ماضي", nameEn: "Ain Madhi" }, { nameAr: "الحويطة", nameEn: "El Houaita" }, { nameAr: "بريدة", nameEn: "Brida" }, { nameAr: "الغيشة", nameEn: "El Ghicha" }
  ]},
  { code: 4, nameAr: "أم البواقي", nameEn: "Oum El Bouaghi", defaultPrice: 600, baladiyas: [
    { nameAr: "أم البواقي", nameEn: "Oum El Bouaghi" }, { nameAr: "عين البيضاء", nameEn: "Ain Beida" }, { nameAr: "عين مليلة", nameEn: "Ain M'lila" }, { nameAr: "سيقوس", nameEn: "Sigus" }, { nameAr: "عين فكرون", nameEn: "Ain Fakroun" }, { nameAr: "مسكيانة", nameEn: "Meskiana" }, { nameAr: "عين الكرمة", nameEn: "Ain Kercha" }, { nameAr: "الفجوج", nameEn: "Fkirina" }
  ]},
  { code: 5, nameAr: "باتنة", nameEn: "Batna", defaultPrice: 600, baladiyas: [
    { nameAr: "باتنة", nameEn: "Batna" }, { nameAr: "بريكة", nameEn: "Barika" }, { nameAr: "عين التوتة", nameEn: "Ain Touta" }, { nameAr: "تيمقاد", nameEn: "Timgad" }, { nameAr: "مروانة", nameEn: "Merouana" }, { nameAr: "أريس", nameEn: "Arris" }, { nameAr: "نقاوس", nameEn: "N'Gaous" }, { nameAr: "سريانة", nameEn: "Seriana" }, { nameAr: "تازولت", nameEn: "Tazoult" }, { nameAr: "منعة", nameEn: "Menaa" }
  ]},
  { code: 6, nameAr: "بجاية", nameEn: "Bejaia", defaultPrice: 550, baladiyas: [
    { nameAr: "بجاية", nameEn: "Bejaia" }, { nameAr: "أقبو", nameEn: "Akbou" }, { nameAr: "سيدي عيش", nameEn: "Sidi Aich" }, { nameAr: "أميزور", nameEn: "Amizour" }, { nameAr: "سوق الإثنين", nameEn: "Souk El Tenine" }, { nameAr: "الكسور", nameEn: "El Kseur" }, { nameAr: "خراطة", nameEn: "Kherrata" }, { nameAr: "تيشي", nameEn: "Tichy" }, { nameAr: "إغيل علي", nameEn: "Ighil Ali" }
  ]},
  { code: 7, nameAr: "بسكرة", nameEn: "Biskra", defaultPrice: 650, baladiyas: [
    { nameAr: "بسكرة", nameEn: "Biskra" }, { nameAr: "طولقة", nameEn: "Tolga" }, { nameAr: "أولاد جلال", nameEn: "Ouled Djellal" }, { nameAr: "سيدي خالد", nameEn: "Sidi Khaled" }, { nameAr: "سيدي عقبة", nameEn: "Sidi Okba" }, { nameAr: "الفيض", nameEn: "El Feidh" }, { nameAr: "زريبة الوادي", nameEn: "Zeribet El Oued" }, { nameAr: "جمورة", nameEn: "Djemorah" }
  ]},
  { code: 8, nameAr: "بشار", nameEn: "Bechar", defaultPrice: 850, baladiyas: [
    { nameAr: "بشار", nameEn: "Bechar" }, { nameAr: "القنادسة", nameEn: "Kenadsa" }, { nameAr: "عبادلة", nameEn: "Abadla" }, { nameAr: "بني ونيف", nameEn: "Beni Ounif" }, { nameAr: "تاغيت", nameEn: "Taghit" }, { nameAr: "بوقايس", nameEn: "Boukaïs" }, { nameAr: "الوطاية", nameEn: "Lahmar" }
  ]},
  { code: 9, nameAr: "البليدة", nameEn: "Blida", defaultPrice: 400, baladiyas: [
    { nameAr: "البليدة", nameEn: "Blida" }, { nameAr: "المدية", nameEn: "El Affroun" }, { nameAr: "بوفاريك", nameEn: "Boufarik" }, { nameAr: "الأربعاء", nameEn: "Larbaa" }, { nameAr: "بوعرفة", nameEn: "Bouarfa" }, { nameAr: "الشفة", nameEn: "Chiffa" }, { nameAr: "موزاية", nameEn: "Mouzaia" }, { nameAr: "شريعة", nameEn: "Chrea" }, { nameAr: "بني مراد", nameEn: "Beni Mered" }
  ]},
  { code: 10, nameAr: "البويرة", nameEn: "Bouira", defaultPrice: 500, baladiyas: [
    { nameAr: "البويرة", nameEn: "Bouira" }, { nameAr: "لقرور", nameEn: "Lakhdaria" }, { nameAr: "سور الغزلان", nameEn: "Sour El Ghozlane" }, { nameAr: "عين بسام", nameEn: "Ain Bessam" }, { nameAr: "المعذر", nameEn: "M'Chedallah" }, { nameAr: "الأخضرية", nameEn: "El Hachimia" }, { nameAr: "برج أوخريص", nameEn: "Bordj Okhriss" }
  ]},
  { code: 11, nameAr: "تمنراست", nameEn: "Tamanrasset", defaultPrice: 1200, baladiyas: [
    { nameAr: "تمنراست", nameEn: "Tamanrasset" }, { nameAr: "عين قزام", nameEn: "In Guezzam" }, { nameAr: "إدلس", nameEn: "Ideles" }, { nameAr: "تين زواتين", nameEn: "Tin Zaouatine" }, { nameAr: "عين صالح", nameEn: "In Salah" }
  ]},
  { code: 12, nameAr: "تبسة", nameEn: "Tebessa", defaultPrice: 650, baladiyas: [
    { nameAr: "تبسة", nameEn: "Tebessa" }, { nameAr: "بئر العاتر", nameEn: "Bir El Ater" }, { nameAr: "الشريعة", nameEn: "Cheria" }, { nameAr: "العوينات", nameEn: "El Aouinet" }, { nameAr: "مرسط", nameEn: "Morsott" }, { nameAr: "نقرين", nameEn: "Negrine" }, { nameAr: "بوخضرة", nameEn: "Boukhadra" }
  ]},
  { code: 13, nameAr: "تلمسان", nameEn: "Tlemcen", defaultPrice: 550, baladiyas: [
    { nameAr: "تلمسان", nameEn: "Tlemcen" }, { nameAr: "مغنية", nameEn: "Maghnia" }, { nameAr: "الغزوات", nameEn: "Ghazaouet" }, { nameAr: "ندرومة", nameEn: "Nedroma" }, { nameAr: "الرمشي", nameEn: "Remchi" }, { nameAr: "سبدو", nameEn: "Sebdou" }, { nameAr: "هنين", nameEn: "Honaine" }, { nameAr: "منصورة", nameEn: "Mansourah" }
  ]},
  { code: 14, nameAr: "تيارت", nameEn: "Tiaret", defaultPrice: 600, baladiyas: [
    { nameAr: "تيارت", nameEn: "Tiaret" }, { nameAr: "فرندة", nameEn: "Frenda" }, { nameAr: "سوقر", nameEn: "Sougueur" }, { nameAr: "قصر الشلالة", nameEn: "Ksar Chellala" }, { nameAr: "مهدية", nameEn: "Mahdia" }, { nameAr: "عين الذهب", nameEn: "Ain Dheb" }, { nameAr: "حمادية", nameEn: "Hammadia" }
  ]},
  { code: 15, nameAr: "تيزي وزو", nameEn: "Tizi Ouzou", defaultPrice: 500, baladiyas: [
    { nameAr: "تيزي وزو", nameEn: "Tizi Ouzou" }, { nameAr: "عزازقة", nameEn: "Azazga" }, { nameAr: "ذراع الميزان", nameEn: "Draa El Mizan" }, { nameAr: "العزازقة", nameEn: "Larbaa Nath Irathen" }, { nameAr: "واضية", nameEn: "Ouadhia" }, { nameAr: "تيقزيرت", nameEn: "Tigzirt" }, { nameAr: "عين الحمام", nameEn: "Ain El Hammam" }, { nameAr: "بوزقن", nameEn: "Bouzeguene" }
  ]},
  { code: 16, nameAr: "الجزائر", nameEn: "Algiers", defaultPrice: 400, baladiyas: [
    { nameAr: "الجزائر الوسطى", nameEn: "Alger Centre" }, { nameAr: "سيدي أمحمد", nameEn: "Sidi M'Hamed" }, { nameAr: "المدنية", nameEn: "El Madania" }, { nameAr: "باب الوادي", nameEn: "Bab El Oued" }, { nameAr: "بلوزداد", nameEn: "Belouizdad" }, { nameAr: "باب الزوار", nameEn: "Bab Ezzouar" }, { nameAr: "الدار البيضاء", nameEn: "Dar El Beida" }, { nameAr: "بئر خادم", nameEn: "Bir Mourad Rais" }, { nameAr: "الحراش", nameEn: "El Harrach" }, { nameAr: "حسين داي", nameEn: "Hussein Dey" }, { nameAr: "الرغاية", nameEn: "Rouiba" }, { nameAr: "دالي إبراهيم", nameEn: "Dely Ibrahim" }, { nameAr: "درارية", nameEn: "Draria" }, { nameAr: "شراقة", nameEn: "Cheraga" }
  ]},
  { code: 17, nameAr: "الجلفة", nameEn: "Djelfa", defaultPrice: 600, baladiyas: [
    { nameAr: "الجلفة", nameEn: "Djelfa" }, { nameAr: "مسعد", nameEn: "Messaad" }, { nameAr: "عين وسارة", nameEn: "Ain Oussera" }, { nameAr: "حاسي بحبح", nameEn: "Hassi Bahbah" }, { nameAr: "الإدريسية", nameEn: "El Idrissia" }, { nameAr: "بيرين", nameEn: "Birine" }, { nameAr: "شرف", nameEn: "Charef" }
  ]},
  { code: 18, nameAr: "جيجل", nameEn: "Jijel", defaultPrice: 600, baladiyas: [
    { nameAr: "جيجل", nameEn: "Jijel" }, { nameAr: "الطاهير", nameEn: "Taher" }, { nameAr: "الميلية", nameEn: "El Milia" }, { nameAr: "الشقفة", nameEn: "Chekfa" }, { nameAr: "زيامة منصورية", nameEn: "Ziama Mansouriah" }, { nameAr: "السطارة", nameEn: "Settara" }, { nameAr: "جيملة", nameEn: "Djimla" }
  ]},
  { code: 19, nameAr: "سطيف", nameEn: "Setif", defaultPrice: 550, baladiyas: [
    { nameAr: "سطيف", nameEn: "Setif" }, { nameAr: "العلمة", nameEn: "El Eulma" }, { nameAr: "عين ولمان", nameEn: "Ain Oulmene" }, { nameAr: "بوعنداس", nameEn: "Bouandas" }, { nameAr: "عين أزال", nameEn: "Ain Azel" }, { nameAr: "عين الكبيرة", nameEn: "Ain El Kebira" }, { nameAr: "الجميلة", nameEn: "Djemila" }, { nameAr: "بني عزيز", nameEn: "Beni Aziz" }
  ]},
  { code: 20, nameAr: "سعيدة", nameEn: "Saida", defaultPrice: 600, baladiyas: [
    { nameAr: "سعيدة", nameEn: "Saida" }, { nameAr: "عين الحجر", nameEn: "Ain El Hadjar" }, { nameAr: "يوب", nameEn: "Youb" }, { nameAr: "الحساسنة", nameEn: "El Hassasna" }, { nameAr: "سيدي بوبكر", nameEn: "Sidi Boubekeur" }
  ]},
  { code: 21, nameAr: "سكيكدة", nameEn: "Skikda", defaultPrice: 600, baladiyas: [
    { nameAr: "سكيكدة", nameEn: "Skikda" }, { nameAr: "القل", nameEn: "Collo" }, { nameAr: "عزابة", nameEn: "Azzaba" }, { nameAr: "تمالوس", nameEn: "Tamalous" }, { nameAr: "الحروش", nameEn: "El Harrouch" }, { nameAr: "رمضان جمال", nameEn: "Ramdane Djamel" }, { nameAr: "سيدي مزغيش", nameEn: "Sidi Mezghiche" }
  ]},
  { code: 22, nameAr: "سيدي بلعباس", nameEn: "Sidi Bel Abbes", defaultPrice: 550, baladiyas: [
    { nameAr: "سيدي بلعباس", nameEn: "Sidi Bel Abbes" }, { nameAr: "عين التبنت", nameEn: "Ain Tindamine" }, { nameAr: "بن باديس", nameEn: "Ben Badis" }, { nameAr: "سفيزف", nameEn: "Sfisef" }, { nameAr: "تلاغ", nameEn: "Telagh" }, { nameAr: "مصطفى بن إبراهيم", nameEn: "Mostefa Ben Brahim" }
  ]},
  { code: 23, nameAr: "عنابة", nameEn: "Annaba", defaultPrice: 550, baladiyas: [
    { nameAr: "عنابة", nameEn: "Annaba" }, { nameAr: "الحجار", nameEn: "El Hadjar" }, { nameAr: "برحال", nameEn: "Berrahal" }, { nameAr: "سيدي عمار", nameEn: "Sidi Amar" }, { nameAr: "العلمة", nameEn: "El Eulma" }, { nameAr: "شطايبي", nameEn: "Chetaibi" }
  ]},
  { code: 24, nameAr: "قالمة", nameEn: "Guelma", defaultPrice: 600, baladiyas: [
    { nameAr: "قالمة", nameEn: "Guelma" }, { nameAr: "حلوفة", nameEn: "Heliopolis" }, { nameAr: "بوشقوف", nameEn: "Bouchegouf" }, { nameAr: "وادي الزناتي", nameEn: "Oued Zenati" }, { nameAr: "هيليوبوليس", nameEn: "Heliopolis" }, { nameAr: "حمام دباغ", nameEn: "Hammam Debagh" }
  ]},
  { code: 25, nameAr: "قسنطينة", nameEn: "Constantine", defaultPrice: 550, baladiyas: [
    { nameAr: "قسنطينة", nameEn: "Constantine" }, { nameAr: "الخروب", nameEn: "El Khroub" }, { nameAr: "عين سمارة", nameEn: "Ain Smara" }, { nameAr: "حامة بوزيان", nameEn: "Hamma Bouziane" }, { nameAr: "ديدوش مراد", nameEn: "Didouche Mourad" }, { nameAr: "زيغود يوسف", nameEn: "Zighoud Youcef" }
  ]},
  { code: 26, nameAr: "المدية", nameEn: "Medea", defaultPrice: 500, baladiyas: [
    { nameAr: "المدية", nameEn: "Medea" }, { nameAr: "قصر البخاري", nameEn: "Ksar El Boukhari" }, { nameAr: "البرواقية", nameEn: "Berrouaghia" }, { nameAr: "تابلاط", nameEn: "Tablat" }, { nameAr: "شلالة العذاورة", nameEn: "Chellalet El Adhaoura" }, { nameAr: "عين بوسيف", nameEn: "Ain Boucif" }, { nameAr: "سغوان", nameEn: "Seghouane" }
  ]},
  { code: 27, nameAr: "مستغانم", nameEn: "Mostaganem", defaultPrice: 550, baladiyas: [
    { nameAr: "مستغانم", nameEn: "Mostaganem" }, { nameAr: "عين تادلس", nameEn: "Ain Tedles" }, { nameAr: "سيرات", nameEn: "Sirat" }, { nameAr: "حاسي ماماش", nameEn: "Hassi Mameche" }, { nameAr: "عشعاشة", nameEn: "Achaacha" }, { nameAr: "بوقيرات", nameEn: "Bouguirat" }
  ]},
  { code: 28, nameAr: "المسيلة", nameEn: "M'sila", defaultPrice: 600, baladiyas: [
    { nameAr: "المسيلة", nameEn: "M'sila" }, { nameAr: "بوسعادة", nameEn: "Bou Saada" }, { nameAr: "سيدي عيسى", nameEn: "Sidi Aissa" }, { nameAr: "عين الملح", nameEn: "Ain El Melh" }, { nameAr: "حمام الضلعة", nameEn: "Hammam Dalaa" }, { nameAr: "مقرة", nameEn: "Magra" }, { nameAr: "جبل مساعد", nameEn: "Djebel Messaad" }
  ]},
  { code: 29, nameAr: "معسكر", nameEn: "Mascara", defaultPrice: 550, baladiyas: [
    { nameAr: "معسكر", nameEn: "Mascara" }, { nameAr: "سيق", nameEn: "Sig" }, { nameAr: "تيقرت", nameEn: "Tighennif" }, { nameAr: "غريس", nameEn: "Ghriss" }, { nameAr: "بوحنيفية", nameEn: "Bouhanifia" }, { nameAr: "عين فارس", nameEn: "Ain Fares" }, { nameAr: "حشم", nameEn: "Hachem" }
  ]},
  { code: 30, nameAr: "ورقلة", nameEn: "Ouargla", defaultPrice: 800, baladiyas: [
    { nameAr: "ورقلة", nameEn: "Ouargla" }, { nameAr: "حاسي مسعود", nameEn: "Hassi Messaoud" }, { nameAr: "تقرت", nameEn: "Touggourt" }, { nameAr: "النقوسة", nameEn: "N'Goussa" }, { nameAr: "تماسين", nameEn: "Temacine" }, { nameAr: "المقارين", nameEn: "Megarine" }, { nameAr: "الرويسات", nameEn: "Rouissat" }
  ]},
  { code: 31, nameAr: "وهران", nameEn: "Oran", defaultPrice: 500, baladiyas: [
    { nameAr: "وهران", nameEn: "Oran" }, { nameAr: "السانية", nameEn: "Es Senia" }, { nameAr: "بئر الجير", nameEn: "Bir El Djir" }, { nameAr: "وادي تليلات", nameEn: "Oued Tlelat" }, { nameAr: "عين الترك", nameEn: "Ain El Turk" }, { nameAr: "أرزيو", nameEn: "Arzew" }, { nameAr: "المرسى الكبير", nameEn: "Mers El Kebir" }, { nameAr: "بوسفر", nameEn: "Bousfer" }, { nameAr: "قديل", nameEn: "Gdyel" }
  ]},
  { code: 32, nameAr: "البيض", nameEn: "El Bayadh", defaultPrice: 750, baladiyas: [
    { nameAr: "البيض", nameEn: "El Bayadh" }, { nameAr: "بوقطب", nameEn: "Bougtob" }, { nameAr: "البنود", nameEn: "El Bnoud" }, { nameAr: "الشلالة", nameEn: "Chellala" }, { nameAr: "بريزينة", nameEn: "Brezina" }, { nameAr: "بوعلام", nameEn: "Boualem" }
  ]},
  { code: 33, nameAr: "إليزي", nameEn: "Illizi", defaultPrice: 1200, baladiyas: [
    { nameAr: "إليزي", nameEn: "Illizi" }, { nameAr: "جانت", nameEn: "Djanet" }, { nameAr: "برج عمر إدريس", nameEn: "Bordj Omar Driss" }, { nameAr: "إن أميناس", nameEn: "In Amenas" }
  ]},
  { code: 34, nameAr: "برج بوعريريج", nameEn: "Bordj Bou Arreridj", defaultPrice: 550, baladiyas: [
    { nameAr: "برج بوعريريج", nameEn: "Bordj Bou Arreridj" }, { nameAr: "رأس الوادي", nameEn: "Ras El Oued" }, { nameAr: "المنصورة", nameEn: "Mansourah" }, { nameAr: "بئر قاصد علي", nameEn: "Bir Kasdali" }, { nameAr: "الجعافرة", nameEn: "El Djaafera" }, { nameAr: "عين تاقروت", nameEn: "Ain Taghrout" }
  ]},
  { code: 35, nameAr: "بومرداس", nameEn: "Boumerdes", defaultPrice: 450, baladiyas: [
    { nameAr: "بومرداس", nameEn: "Boumerdes" }, { nameAr: "برج منايل", nameEn: "Bordj Menaiel" }, { nameAr: "ذراع بن خدة", nameEn: "Dellys" }, { nameAr: "بودواو", nameEn: "Boudouaou" }, { nameAr: "الثنية", nameEn: "Thenia" }, { nameAr: "خميس الخشنة", nameEn: "Khemis El Khechna" }, { nameAr: "الأربعطاش", nameEn: "Larbatache" }, { nameAr: "الناصرية", nameEn: "Naciria" }
  ]},
  { code: 36, nameAr: "الطارف", nameEn: "El Tarf", defaultPrice: 600, baladiyas: [
    { nameAr: "الطارف", nameEn: "El Tarf" }, { nameAr: "القالة", nameEn: "El Kala" }, { nameAr: "بوحجار", nameEn: "Bouhadjar" }, { nameAr: "بن مهيدي", nameEn: "Ben M'Hidi" }, { nameAr: "بسبس", nameEn: "Besbes" }, { nameAr: "الذرعان", nameEn: "Drean" }
  ]},
  { code: 37, nameAr: "تندوف", nameEn: "Tindouf", defaultPrice: 1100, baladiyas: [
    { nameAr: "تندوف", nameEn: "Tindouf" }, { nameAr: "أم العسل", nameEn: "Oum El Assel" }
  ]},
  { code: 38, nameAr: "تيسمسيلت", nameEn: "Tissemsilt", defaultPrice: 600, baladiyas: [
    { nameAr: "تيسمسيلت", nameEn: "Tissemsilt" }, { nameAr: "ثنية الحد", nameEn: "Theniet El Had" }, { nameAr: "برج بونعامة", nameEn: "Bordj Bou Naama" }, { nameAr: "الأربعاء", nameEn: "Larbaa" }, { nameAr: "خميستي", nameEn: "Khemisti" }, { nameAr: "عماري", nameEn: "Ammari" }
  ]},
  { code: 39, nameAr: "الوادي", nameEn: "El Oued", defaultPrice: 750, baladiyas: [
    { nameAr: "الوادي", nameEn: "El Oued" }, { nameAr: "قمار", nameEn: "Guemar" }, { nameAr: "المغير", nameEn: "El M'Ghair" }, { nameAr: "جامعة", nameEn: "Djamaa" }, { nameAr: "الرباح", nameEn: "Robbah" }, { nameAr: "حاسي خليفة", nameEn: "Hassi Khalifa" }, { nameAr: "طالب العربي", nameEn: "Taleb Larbi" }
  ]},
  { code: 40, nameAr: "خنشلة", nameEn: "Khenchela", defaultPrice: 650, baladiyas: [
    { nameAr: "خنشلة", nameEn: "Khenchela" }, { nameAr: "قايس", nameEn: "Kais" }, { nameAr: "بوحمامة", nameEn: "Bouhmama" }, { nameAr: "الحامة", nameEn: "El Hamma" }, { nameAr: "عين الطويلة", nameEn: "Ain Touila" }, { nameAr: "شلية", nameEn: "Chechar" }
  ]},
  { code: 41, nameAr: "سوق أهراس", nameEn: "Souk Ahras", defaultPrice: 600, baladiyas: [
    { nameAr: "سوق أهراس", nameEn: "Souk Ahras" }, { nameAr: "سدراتة", nameEn: "Sedrata" }, { nameAr: "حنانشة", nameEn: "Hanancha" }, { nameAr: "مشروحة", nameEn: "Mechroha" }, { nameAr: "المراهنة", nameEn: "M'Daourouche" }, { nameAr: "تاورة", nameEn: "Taoura" }
  ]},
  { code: 42, nameAr: "تيبازة", nameEn: "Tipaza", defaultPrice: 450, baladiyas: [
    { nameAr: "تيبازة", nameEn: "Tipaza" }, { nameAr: "شرشال", nameEn: "Cherchell" }, { nameAr: "القليعة", nameEn: "Kolea" }, { nameAr: "حجوط", nameEn: "Hadjout" }, { nameAr: "فوكة", nameEn: "Fouka" }, { nameAr: "سيدي غيلاس", nameEn: "Sidi Ghiles" }, { nameAr: "أحمر العين", nameEn: "Ahmer El Ain" }, { nameAr: "بواسماعيل", nameEn: "Bou Ismail" }
  ]},
  { code: 43, nameAr: "ميلة", nameEn: "Mila", defaultPrice: 600, baladiyas: [
    { nameAr: "ميلة", nameEn: "Mila" }, { nameAr: "فرجيوة", nameEn: "Ferdjioua" }, { nameAr: "شلغوم العيد", nameEn: "Chelghoum Laid" }, { nameAr: "التلاغمة", nameEn: "Teleghma" }, { nameAr: "وادي العثمانية", nameEn: "Oued Athmania" }, { nameAr: "تاجنانت", nameEn: "Tadjenanet" }
  ]},
  { code: 44, nameAr: "عين الدفلى", nameEn: "Ain Defla", defaultPrice: 500, baladiyas: [
    { nameAr: "عين الدفلى", nameEn: "Ain Defla" }, { nameAr: "المليانة", nameEn: "Miliana" }, { nameAr: "خميس مليانة", nameEn: "Khemis Miliana" }, { nameAr: "الجندل", nameEn: "Djendel" }, { nameAr: "العطاف", nameEn: "El Attaf" }, { nameAr: "بوميدفع", nameEn: "Boumedfaa" }, { nameAr: "الأبيار", nameEn: "El Abadia" }
  ]},
  { code: 45, nameAr: "النعامة", nameEn: "Naama", defaultPrice: 750, baladiyas: [
    { nameAr: "النعامة", nameEn: "Naama" }, { nameAr: "المشرية", nameEn: "Mecheria" }, { nameAr: "عين الصفراء", nameEn: "Ain Sefra" }, { nameAr: "تيوت", nameEn: "Tiout" }, { nameAr: "مقرار", nameEn: "Moghrar" }, { nameAr: "عسلة", nameEn: "Asla" }
  ]},
  { code: 46, nameAr: "عين تموشنت", nameEn: "Ain Temouchent", defaultPrice: 550, baladiyas: [
    { nameAr: "عين تموشنت", nameEn: "Ain Temouchent" }, { nameAr: "بني صاف", nameEn: "Beni Saf" }, { nameAr: "الحمام بوحجر", nameEn: "Hammam Bou Hadjar" }, { nameAr: "عين الأربعاء", nameEn: "Ain El Arbaa" }, { nameAr: "الملاح", nameEn: "El Malah" }, { nameAr: "عين الكيحل", nameEn: "Ain Kihal" }
  ]},
  { code: 47, nameAr: "غرداية", nameEn: "Ghardaia", defaultPrice: 750, baladiyas: [
    { nameAr: "غرداية", nameEn: "Ghardaia" }, { nameAr: "المنيعة", nameEn: "El Meniaa" }, { nameAr: "متليلي", nameEn: "Metlili" }, { nameAr: "بريان", nameEn: "Berriane" }, { nameAr: "بنورة", nameEn: "Bounoura" }, { nameAr: "الأطرش", nameEn: "El Atteuf" }, { nameAr: "الضاية", nameEn: "Daia" }
  ]},
  { code: 48, nameAr: "غليزان", nameEn: "Relizane", defaultPrice: 550, baladiyas: [
    { nameAr: "غليزان", nameEn: "Relizane" }, { nameAr: "وادي رهيو", nameEn: "Oued Rhiou" }, { nameAr: "مازونة", nameEn: "Mazouna" }, { nameAr: "زمورة", nameEn: "Zemmoura" }, { nameAr: "عين طارق", nameEn: "Ain Tarek" }, { nameAr: "الجديوية", nameEn: "Djidioua" }
  ]},
  { code: 49, nameAr: "تيميمون", nameEn: "Timimoun", defaultPrice: 1000, baladiyas: [
    { nameAr: "تيميمون", nameEn: "Timimoun" }, { nameAr: "أوقروت", nameEn: "Ougrout" }, { nameAr: "تالمين", nameEn: "Talmine" }, { nameAr: "شروين", nameEn: "Charouine" }
  ]},
  { code: 50, nameAr: "المغير", nameEn: "El M'Ghair", defaultPrice: 750, baladiyas: [
    { nameAr: "المغير", nameEn: "El M'Ghair" }, { nameAr: "جامعة", nameEn: "Djamaa" }, { nameAr: "الطيبات", nameEn: "Oum Touyour" }, { nameAr: "سيدي خليل", nameEn: "Sidi Khelil" }
  ]},
  { code: 51, nameAr: "المنيعة", nameEn: "El Meniaa", defaultPrice: 900, baladiyas: [
    { nameAr: "المنيعة", nameEn: "El Meniaa" }, { nameAr: "حاسي الجمل", nameEn: "Hassi El Gara" }
  ]},
  { code: 52, nameAr: "أولاد جلال", nameEn: "Ouled Djellal", defaultPrice: 700, baladiyas: [
    { nameAr: "أولاد جلال", nameEn: "Ouled Djellal" }, { nameAr: "سيدي خالد", nameEn: "Sidi Khaled" }, { nameAr: "الدوسن", nameEn: "Doucen" }, { nameAr: "الشعيبة", nameEn: "Echaiba" }
  ]},
  { code: 53, nameAr: "برج باجي مختار", nameEn: "Bordj Badji Mokhtar", defaultPrice: 1200, baladiyas: [
    { nameAr: "برج باجي مختار", nameEn: "Bordj Badji Mokhtar" }, { nameAr: "تيمياوين", nameEn: "Timiaouine" }
  ]},
  { code: 54, nameAr: "بني عباس", nameEn: "Beni Abbes", defaultPrice: 950, baladiyas: [
    { nameAr: "بني عباس", nameEn: "Beni Abbes" }, { nameAr: "إقلي", nameEn: "Igli" }, { nameAr: "تامطرت", nameEn: "Tamtert" }, { nameAr: "القصابي", nameEn: "El Ouata" }
  ]},
  { code: 55, nameAr: "إن صالح", nameEn: "In Salah", defaultPrice: 1100, baladiyas: [
    { nameAr: "إن صالح", nameEn: "In Salah" }, { nameAr: "إن قزام", nameEn: "In Ghar" }, { nameAr: "فقارة الزوى", nameEn: "Foggaret Ezzaouia" }
  ]},
  { code: 56, nameAr: "إن قزام", nameEn: "In Guezzam", defaultPrice: 1300, baladiyas: [
    { nameAr: "إن قزام", nameEn: "In Guezzam" }, { nameAr: "تين زواتين", nameEn: "Tin Zaouatine" }
  ]},
  { code: 57, nameAr: "تقرت", nameEn: "Touggourt", defaultPrice: 750, baladiyas: [
    { nameAr: "تقرت", nameEn: "Touggourt" }, { nameAr: "تماسين", nameEn: "Temacine" }, { nameAr: "المقارين", nameEn: "Megarine" }, { nameAr: "الحجيرة", nameEn: "El Hadjira" }
  ]},
  { code: 58, nameAr: "جانت", nameEn: "Djanet", defaultPrice: 1200, baladiyas: [
    { nameAr: "جانت", nameEn: "Djanet" }, { nameAr: "برج الحواس", nameEn: "Bordj El Haouas" }
  ]},
];
