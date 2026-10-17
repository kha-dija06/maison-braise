/* =================================================================
   MAISON BRAISE — Internationalisation (EN / FR / AR)

   HOW IT WORKS
   • All translatable text lives in I18N_DATA below (one block per
     language). English is the reference language and the fallback.
   • In index.html, static text carries a data-i18n="key" attribute;
     translated attributes use data-i18n-attr="attr:key;attr2:key2".
     Strings with a placeholder, e.g. "Review {n}", read the value from
     data-i18n-n="1".
   • Dynamic content (menu cards, gallery, validation messages, the
     open/closed badge…) is built in script.js with I18N.t("key").
   • The chosen language is saved in localStorage ("lang") and can be
     forced with ?lang=fr in the URL. First visit: browser language.
   • Arabic switches the page to right-to-left: <html dir="rtl"> and
     Bootstrap's RTL stylesheet (see style.css for the RTL overrides).

   TO ADD A LANGUAGE: add a block to I18N_DATA, add its code to
   SUPPORTED_LANGS (and RTL_LANGS if right-to-left), add a button in
   the .lang-switch markup, and a flatpickr locale script in index.html.

   This file must be loaded in <head>, before the stylesheets it
   injects (it writes the correct Bootstrap CSS: LTR or RTL).
   ================================================================= */
(function () {
  "use strict";

  var SUPPORTED_LANGS = ["en", "fr", "ar"];
  var RTL_LANGS = ["ar"];
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "lang";
  var BOOTSTRAP_LTR = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  var BOOTSTRAP_RTL = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css";

  /* =============================================================
     TRANSLATIONS
     ============================================================= */
  var I18N_DATA = {

    /* ---------------------------- ENGLISH ---------------------------- */
    en: {
      "meta.title": "Maison Braise | Restaurant",
      "meta.desc": "Maison Braise — a modern restaurant showcase: menu, gallery, opening hours and easy WhatsApp reservations.",
      "meta.ogdesc": "Fire-cooked food, warm nights — discover our menu, gallery and easy WhatsApp reservations.",

      "promo.text": "🔥 Promo: -20% on the entire menu this Friday",
      "promo.close": "Dismiss promotion",

      "nav.home": "Home", "nav.menu": "Menu", "nav.gallery": "Gallery", "nav.about": "About", "nav.contact": "Contact",
      "nav.toggle": "Toggle navigation",
      "cta.reserve": "Reserve a Table",
      "theme.toDark": "Switch to dark mode",
      "theme.toLight": "Switch to light mode",
      "lang.label": "Language",
      "currency": "MAD",

      "hero.badge": "Welcome to Maison Braise",
      "hero.title1": "Bold Flavors,",
      "hero.title2": "Warm Atmosphere",
      "hero.sub": "Seasonal, fire-cooked dishes served in a warm, unhurried dining room — come hungry, stay for the evening.",
      "hero.viewMenu": "View Menu",
      "hero.scroll": "Scroll to menu section",

      "menu.eyebrow": "Our Menu",
      "menu.title": "Discover Our Delicious Dishes",
      "menu.desc": "Every plate is cooked over an open flame and built around what's in season — simple, generous food meant to be shared.",
      "menu.filters": "Filter dishes by category",
      "filter.all": "All", "filter.starters": "Starters", "filter.mains": "Main Courses", "filter.desserts": "Desserts", "filter.drinks": "Drinks",
      "menu.order": "Order",
      "menu.viewFull": "View Full Menu",

      "dish.1.name": "Grilled Halloumi Skewers", "dish.1.desc": "Charred halloumi, honey-lemon glaze, toasted pistachio.",
      "dish.2.name": "Charred Octopus", "dish.2.desc": "Smoked paprika, crushed potatoes, salsa verde.",
      "dish.3.name": "Braised Lamb Shoulder", "dish.3.desc": "Slow-cooked twelve hours, root vegetables, red wine jus.",
      "dish.4.name": "Wood-Fired Sea Bream", "dish.4.desc": "Whole roasted, preserved lemon, herb butter.",
      "dish.5.name": "Braise Burger", "dish.5.desc": "Dry-aged beef, smoked cheddar, caramelized onion.",
      "dish.6.name": "Roasted Pumpkin Risotto", "dish.6.desc": "Toasted seeds, sage brown butter, parmesan.",
      "dish.7.name": "Dark Chocolate Fondant", "dish.7.desc": "Molten center, salted caramel, vanilla bean ice cream.",
      "dish.8.name": "Orange Blossom Crème Brûlée", "dish.8.desc": "Torched sugar crust, citrus zest.",
      "dish.9.name": "Mint Lemonade", "dish.9.desc": "Fresh mint, lemon, sparkling water.",
      "dish.10.name": "Spiced Moroccan Coffee", "dish.10.desc": "Cardamom, cinnamon, dark roast.",

      "gallery.eyebrow": "Our Gallery",
      "gallery.title": "A Glimpse Into Our World",
      "gallery.desc": "From the open flame to the last plate — moments from the dining room, the kitchen and the terrace.",
      "gallery.instagram": "Follow us on Instagram",
      "gallery.open": "Open photo: {caption}",
      "gallery.1.caption": "Our cozy interior", "gallery.1.alt": "Cozy dining room with warm lighting",
      "gallery.2.caption": "Fresh ingredients", "gallery.2.alt": "Fresh vegetables being prepared on a wooden board",
      "gallery.3.caption": "Behind the pass", "gallery.3.alt": "Chef plating a dish in the kitchen",
      "gallery.4.caption": "Cooked over fire", "gallery.4.alt": "Meat grilling over an open flame",
      "gallery.5.caption": "Evenings on the terrace", "gallery.5.alt": "Outdoor terrace seating at dusk",
      "gallery.6.caption": "Sweet endings", "gallery.6.alt": "Close-up of a finished dessert",

      "testi.eyebrow": "Testimonials",
      "testi.title": "What Our Guests Say",
      "testi.desc": "A few words from the people who keep coming back for seconds — and thirds.",
      "testi.review": "Review {n}",
      "testi.stars": "5 out of 5 stars",
      "testi.prev": "Previous review", "testi.next": "Next review",
      "testi.1.quote": "\"The lamb shoulder alone is worth the trip — it falls apart the second your fork touches it. This is our go-to for every anniversary now.\"",
      "testi.2.quote": "\"Best halloumi in the city, hands down. The staff remembered our order from last time — that's the kind of place this is.\"",
      "testi.3.quote": "\"Cozy, warm, and the octopus starter was incredible. We came for a quick dinner and stayed for dessert — everything we tried was excellent.\"",
      "testi.4.quote": "\"Booked through WhatsApp in two minutes and our table was ready right on time. The pumpkin risotto is criminally good.\"",
      "testi.5.quote": "\"We stumbled in during a trip to Salé and ended up going back three nights in a row. The terrace at sunset is unbeatable.\"",
      "testi.role.regular": "Regular Guest", "testi.role.local": "Local Regular", "testi.role.first": "First-Time Visitor", "testi.role.travel": "Traveling Guest",

      "about.alt": "Maison Braise dining room and open kitchen",
      "about.since": "Since",
      "about.eyebrow": "About Us",
      "about.title": "A Story of Passion & Flavor",
      "about.p1": "Maison Braise opened its doors in 2010 with a simple idea: cook everything over live fire, source what's close by, and let people linger at the table.",
      "about.p2": "What began as a small neighborhood grill has grown into a gathering place — but the kitchen still runs on the same rhythm: market runs at dawn, slow braises through the afternoon, and the last plate going out well after midnight.",
      "about.h1": "Fresh local ingredients", "about.h2": "Traditional recipes, reimagined", "about.h3": "Warm & cozy atmosphere",
      "about.discover": "Discover More",
      "stat.years": "Years of Experience", "stat.dishes": "Dishes on the Menu", "stat.customers": "Happy Customers", "stat.rating": "Average Rating",
      "team.eyebrow": "Our Team",
      "team.title": "Meet the Chefs Behind the Fire",
      "team.1.role": "Executive Chef & Founder", "team.2.role": "Sous Chef", "team.3.role": "Grill Master",
      "team.1.bio": "Twenty years at the grill, from Marrakech kitchens to Lyon. He still lights the first fire every morning.",
      "team.2.bio": "Runs the pass with calm precision and builds our seasonal menu around what the market delivers at dawn.",
      "team.3.bio": "Master of wood, smoke and patience — the reason our lamb falls apart at the touch of a fork.",
      "team.1.alt": "Portrait of Chef Yassine Amrani", "team.2.alt": "Portrait of Chef Salma Benjelloun", "team.3.alt": "Portrait of Chef Karim Ouazzani",
      "about.quote": "\"Cook with fire, cook with patience, and the rest takes care of itself.\"",
      "about.quoteBy": "Chef Yassine Amrani, Founder",

      "contact.eyebrow": "Contact Us",
      "contact.title": "Visit Us or Get in Touch",
      "contact.desc": "Book a table, ask a question, or just say hello — we'll get back to you as soon as we can.",
      "hours.title": "Opening Hours",
      "hours.weekdays": "Mon – Thu", "hours.weekend": "Fri – Sun",
      "contact.addressTitle": "Address",
      "contact.address": "123 Avenue Mohammed VI, Salé, Morocco",
      "contact.directions": "Get Directions",
      "contact.callTitle": "Call, Message or Email",
      "form.name": "Name", "form.phone": "Phone", "form.date": "Date", "form.time": "Time", "form.guests": "Number of Guests",
      "form.select": "Select...",
      "form.datePlaceholder": "Select a date", "form.timePlaceholder": "Select a time",
      "form.err.name": "Please enter your name.",
      "form.err.phone": "Please enter a valid phone number.",
      "form.err.date": "Please choose an available date.",
      "form.err.sunday": "Online reservations are unavailable on Sundays.",
      "form.err.time": "Please choose a time.",
      "form.err.timePast": "Please choose a time later today.",
      "form.err.guests": "Please select the number of guests.",
      "form.send": "Send via WhatsApp",
      "map.title": "Restaurant location map",

      "footer.tagline": "Fire-cooked food, warm nights, and a table that's always ready for you.",
      "footer.quick": "Quick Links",
      "footer.contact": "Contact",
      "footer.checking": "Checking hours…",
      "footer.open": "Open Now",
      "footer.closed": "Closed Now",
      "footer.rights": "Maison Braise. All rights reserved.",
      "footer.privacy": "Privacy Policy", "footer.terms": "Terms of Service",
      "social.follow": "Follow us on {n}",

      "lightbox.close": "Close", "lightbox.prev": "Previous image", "lightbox.next": "Next image",
      "fab.reserve": "Reserve a table on WhatsApp",
      "fab.top": "Back to top",

      "wa.reserve": "Hello Maison Braise, I'd like to reserve a table.",
      "wa.menu": "Hello Maison Braise, could you please send me your full menu?",
      "wa.info": "Hello Maison Braise, I'd like some information.",
      "wa.order": "Hello, I would like to order: {name} ({price} {cur})",

      "res.hello": "Hello Maison Braise,",
      "res.intro": "I would like to book a table:",
      "res.name": "Name:", "res.phone": "Phone:", "res.date": "Date:", "res.time": "Time:", "res.guests": "Guests:",
      "res.six": "6 or more",
      "res.thanks": "Please confirm availability, thank you."
    },

    /* ----------------------------- FRANÇAIS ----------------------------- */
    fr: {
      "meta.title": "Maison Braise | Restaurant",
      "meta.desc": "Maison Braise — vitrine d'un restaurant moderne : menu, galerie, horaires d'ouverture et réservation facile via WhatsApp.",
      "meta.ogdesc": "Cuisine au feu de bois, soirées chaleureuses — découvrez notre menu, notre galerie et réservez facilement sur WhatsApp.",

      "promo.text": "🔥 Promo : -20 % sur tout le menu ce vendredi",
      "promo.close": "Fermer la promotion",

      "nav.home": "Accueil", "nav.menu": "Menu", "nav.gallery": "Galerie", "nav.about": "À propos", "nav.contact": "Contact",
      "nav.toggle": "Afficher ou masquer la navigation",
      "cta.reserve": "Réserver une table",
      "theme.toDark": "Passer en mode sombre",
      "theme.toLight": "Passer en mode clair",
      "lang.label": "Langue",
      "currency": "MAD",

      "hero.badge": "Bienvenue chez Maison Braise",
      "hero.title1": "Des saveurs audacieuses,",
      "hero.title2": "une ambiance chaleureuse",
      "hero.sub": "Des plats de saison cuits au feu de bois, servis dans une salle chaleureuse où l'on prend son temps — venez avec de l'appétit, restez pour la soirée.",
      "hero.viewMenu": "Voir le menu",
      "hero.scroll": "Aller à la section menu",

      "menu.eyebrow": "Notre menu",
      "menu.title": "Découvrez nos plats savoureux",
      "menu.desc": "Chaque assiette est cuite à la flamme et construite autour des produits de saison — une cuisine simple et généreuse, faite pour être partagée.",
      "menu.filters": "Filtrer les plats par catégorie",
      "filter.all": "Tout", "filter.starters": "Entrées", "filter.mains": "Plats principaux", "filter.desserts": "Desserts", "filter.drinks": "Boissons",
      "menu.order": "Commander",
      "menu.viewFull": "Voir le menu complet",

      "dish.1.name": "Brochettes de halloumi grillées", "dish.1.desc": "Halloumi grillé, glaçage miel-citron, pistaches torréfiées.",
      "dish.2.name": "Poulpe grillé", "dish.2.desc": "Paprika fumé, pommes de terre écrasées, salsa verde.",
      "dish.3.name": "Épaule d'agneau braisée", "dish.3.desc": "Cuite lentement pendant douze heures, légumes racines, jus au vin rouge.",
      "dish.4.name": "Daurade au feu de bois", "dish.4.desc": "Rôtie entière, citron confit, beurre aux herbes.",
      "dish.5.name": "Burger Braise", "dish.5.desc": "Bœuf maturé, cheddar fumé, oignon caramélisé.",
      "dish.6.name": "Risotto à la courge rôtie", "dish.6.desc": "Graines grillées, beurre noisette à la sauge, parmesan.",
      "dish.7.name": "Fondant au chocolat noir", "dish.7.desc": "Cœur coulant, caramel au beurre salé, glace à la vanille.",
      "dish.8.name": "Crème brûlée à la fleur d'oranger", "dish.8.desc": "Croûte de sucre caramélisée, zeste d'agrumes.",
      "dish.9.name": "Limonade à la menthe", "dish.9.desc": "Menthe fraîche, citron, eau pétillante.",
      "dish.10.name": "Café marocain épicé", "dish.10.desc": "Cardamome, cannelle, torréfaction foncée.",

      "gallery.eyebrow": "Notre galerie",
      "gallery.title": "Un aperçu de notre univers",
      "gallery.desc": "De la flamme au dernier plat — des moments de la salle, de la cuisine et de la terrasse.",
      "gallery.instagram": "Suivez-nous sur Instagram",
      "gallery.open": "Ouvrir la photo : {caption}",
      "gallery.1.caption": "Notre intérieur chaleureux", "gallery.1.alt": "Salle à manger chaleureuse à la lumière douce",
      "gallery.2.caption": "Ingrédients frais", "gallery.2.alt": "Légumes frais préparés sur une planche en bois",
      "gallery.3.caption": "Derrière le passe", "gallery.3.alt": "Chef dressant une assiette en cuisine",
      "gallery.4.caption": "Cuit au feu", "gallery.4.alt": "Viande grillée à la flamme",
      "gallery.5.caption": "Soirées en terrasse", "gallery.5.alt": "Terrasse extérieure au crépuscule",
      "gallery.6.caption": "Une fin sucrée", "gallery.6.alt": "Gros plan sur un dessert terminé",

      "testi.eyebrow": "Témoignages",
      "testi.title": "Ce que disent nos clients",
      "testi.desc": "Quelques mots de ceux qui reviennent pour se resservir — et se resservir encore.",
      "testi.review": "Avis {n}",
      "testi.stars": "5 étoiles sur 5",
      "testi.prev": "Avis précédent", "testi.next": "Avis suivant",
      "testi.1.quote": "« L'épaule d'agneau vaut à elle seule le déplacement — elle se détache dès que la fourchette la touche. C'est désormais notre adresse pour chaque anniversaire. »",
      "testi.2.quote": "« Le meilleur halloumi de la ville, sans hésiter. L'équipe se souvenait de notre commande de la dernière fois — c'est ça, cet endroit. »",
      "testi.3.quote": "« Cosy, chaleureux, et l'entrée de poulpe était incroyable. Nous sommes venus pour un dîner rapide et sommes restés pour le dessert — tout ce que nous avons goûté était excellent. »",
      "testi.4.quote": "« Réservé sur WhatsApp en deux minutes et notre table était prête à l'heure. Le risotto à la courge est tout simplement démentiel. »",
      "testi.5.quote": "« Nous sommes entrés par hasard lors d'un voyage à Salé et sommes revenus trois soirs de suite. La terrasse au coucher du soleil est imbattable. »",
      "testi.role.regular": "Client fidèle", "testi.role.local": "Habitué du quartier", "testi.role.first": "Première visite", "testi.role.travel": "Client de passage",

      "about.alt": "Salle à manger et cuisine ouverte de Maison Braise",
      "about.since": "Depuis",
      "about.eyebrow": "Qui sommes-nous",
      "about.title": "Une histoire de passion et de saveurs",
      "about.p1": "Maison Braise a ouvert ses portes en 2010 avec une idée simple : tout cuire au feu vif, s'approvisionner à proximité et laisser les gens s'attarder à table.",
      "about.p2": "Ce qui était un petit grill de quartier est devenu un lieu de rencontre — mais la cuisine garde le même rythme : le marché à l'aube, les braisés lents tout l'après-midi, et la dernière assiette qui part bien après minuit.",
      "about.h1": "Ingrédients locaux et frais", "about.h2": "Recettes traditionnelles revisitées", "about.h3": "Ambiance chaleureuse et conviviale",
      "about.discover": "En savoir plus",
      "stat.years": "Années d'expérience", "stat.dishes": "Plats au menu", "stat.customers": "Clients satisfaits", "stat.rating": "Note moyenne",
      "team.eyebrow": "Notre équipe",
      "team.title": "Rencontrez les chefs derrière le feu",
      "team.1.role": "Chef exécutif et fondateur", "team.2.role": "Sous-chef", "team.3.role": "Maître grilleur",
      "team.1.bio": "Vingt ans derrière le grill, des cuisines de Marrakech à Lyon. Il allume encore le premier feu chaque matin.",
      "team.2.bio": "Dirige le passe avec un calme précis et construit notre menu de saison autour de ce que le marché livre à l'aube.",
      "team.3.bio": "Maître du bois, de la fumée et de la patience — la raison pour laquelle notre agneau se détache à la fourchette.",
      "team.1.alt": "Portrait du chef Yassine Amrani", "team.2.alt": "Portrait de la cheffe Salma Benjelloun", "team.3.alt": "Portrait du chef Karim Ouazzani",
      "about.quote": "« Cuisinez au feu, cuisinez avec patience, et le reste suit tout seul. »",
      "about.quoteBy": "Chef Yassine Amrani, fondateur",

      "contact.eyebrow": "Nous contacter",
      "contact.title": "Rendez-nous visite ou écrivez-nous",
      "contact.desc": "Réservez une table, posez une question ou dites simplement bonjour — nous vous répondrons dès que possible.",
      "hours.title": "Horaires d'ouverture",
      "hours.weekdays": "Lun – Jeu", "hours.weekend": "Ven – Dim",
      "contact.addressTitle": "Adresse",
      "contact.address": "123 Avenue Mohammed VI, Salé, Maroc",
      "contact.directions": "Itinéraire",
      "contact.callTitle": "Appelez, écrivez ou envoyez un e-mail",
      "form.name": "Nom", "form.phone": "Téléphone", "form.date": "Date", "form.time": "Heure", "form.guests": "Nombre de personnes",
      "form.select": "Sélectionner…",
      "form.datePlaceholder": "Choisir une date", "form.timePlaceholder": "Choisir une heure",
      "form.err.name": "Veuillez saisir votre nom.",
      "form.err.phone": "Veuillez saisir un numéro de téléphone valide.",
      "form.err.date": "Veuillez choisir une date disponible.",
      "form.err.sunday": "Les réservations en ligne ne sont pas disponibles le dimanche.",
      "form.err.time": "Veuillez choisir une heure.",
      "form.err.timePast": "Veuillez choisir une heure plus tardive aujourd'hui.",
      "form.err.guests": "Veuillez sélectionner le nombre de personnes.",
      "form.send": "Envoyer via WhatsApp",
      "map.title": "Carte de localisation du restaurant",

      "footer.tagline": "Une cuisine au feu de bois, des soirées chaleureuses et une table toujours prête pour vous.",
      "footer.quick": "Liens rapides",
      "footer.contact": "Contact",
      "footer.checking": "Vérification des horaires…",
      "footer.open": "Ouvert maintenant",
      "footer.closed": "Fermé actuellement",
      "footer.rights": "Maison Braise. Tous droits réservés.",
      "footer.privacy": "Politique de confidentialité", "footer.terms": "Conditions d'utilisation",
      "social.follow": "Suivez-nous sur {n}",

      "lightbox.close": "Fermer", "lightbox.prev": "Image précédente", "lightbox.next": "Image suivante",
      "fab.reserve": "Réserver une table sur WhatsApp",
      "fab.top": "Retour en haut",

      "wa.reserve": "Bonjour Maison Braise, je souhaite réserver une table.",
      "wa.menu": "Bonjour Maison Braise, pourriez-vous m'envoyer votre menu complet ?",
      "wa.info": "Bonjour Maison Braise, j'aimerais obtenir des informations.",
      "wa.order": "Bonjour, je souhaite commander : {name} ({price} {cur})",

      "res.hello": "Bonjour Maison Braise,",
      "res.intro": "Je souhaite réserver une table :",
      "res.name": "Nom :", "res.phone": "Téléphone :", "res.date": "Date :", "res.time": "Heure :", "res.guests": "Personnes :",
      "res.six": "6 ou plus",
      "res.thanks": "Merci de me confirmer la disponibilité."
    },

    /* ------------------------------ العربية ------------------------------ */
    ar: {
      "meta.title": "Maison Braise | مطعم",
      "meta.desc": "Maison Braise — واجهة مطعم عصري: قائمة الطعام، معرض الصور، ساعات العمل وحجز سهل عبر واتساب.",
      "meta.ogdesc": "أطباق مطهوّة على النار وأمسيات دافئة — اكتشفوا قائمتنا ومعرض صورنا واحجزوا بسهولة عبر واتساب.",

      "promo.text": "🔥 عرض خاص: خصم 20% على كامل القائمة يوم الجمعة",
      "promo.close": "إغلاق العرض",

      "nav.home": "الرئيسية", "nav.menu": "القائمة", "nav.gallery": "المعرض", "nav.about": "من نحن", "nav.contact": "اتصل بنا",
      "nav.toggle": "تبديل قائمة التنقل",
      "cta.reserve": "احجز طاولة",
      "theme.toDark": "التبديل إلى الوضع الداكن",
      "theme.toLight": "التبديل إلى الوضع الفاتح",
      "lang.label": "اللغة",
      "currency": "د.م.",

      "hero.badge": "مرحبًا بكم في Maison Braise",
      "hero.title1": "نكهات جريئة،",
      "hero.title2": "أجواء دافئة",
      "hero.sub": "أطباق موسمية مطهوّة على نار الحطب، تُقدَّم في قاعة دافئة وهادئة — تعالوا جائعين وابقوا لقضاء السهرة.",
      "hero.viewMenu": "عرض القائمة",
      "hero.scroll": "الانتقال إلى قسم القائمة",

      "menu.eyebrow": "قائمتنا",
      "menu.title": "اكتشفوا أطباقنا الشهية",
      "menu.desc": "كل طبق يُطهى على نار مكشوفة ويُبنى حول مكوّنات الموسم — طعام بسيط وسخيّ يُقدَّم للمشاركة.",
      "menu.filters": "تصفية الأطباق حسب الفئة",
      "filter.all": "الكل", "filter.starters": "المقبّلات", "filter.mains": "الأطباق الرئيسية", "filter.desserts": "الحلويات", "filter.drinks": "المشروبات",
      "menu.order": "اطلب",
      "menu.viewFull": "عرض القائمة كاملة",

      "dish.1.name": "أسياخ حلّوم مشوية", "dish.1.desc": "حلّوم مشوي، صلصة العسل والليمون، فستق محمّص.",
      "dish.2.name": "أخطبوط مشوي", "dish.2.desc": "فلفل أحمر مدخّن، بطاطس مهروسة، صلصة سالسا فيردي.",
      "dish.3.name": "كتف خروف مطهوّ ببطء", "dish.3.desc": "طُهي ببطء اثنتي عشرة ساعة، خضار جذرية، مرق النبيذ الأحمر.",
      "dish.4.name": "سمك الدنيس على نار الحطب", "dish.4.desc": "مشوي كاملًا، ليمون مخلّل، زبدة بالأعشاب.",
      "dish.5.name": "برغر بريز", "dish.5.desc": "لحم بقري معتّق، شيدر مدخّن، بصل مكرمل.",
      "dish.6.name": "ريزوتو القرع المحمّص", "dish.6.desc": "بذور محمّصة، زبدة بنّية بالمريمية، جبن بارميزان.",
      "dish.7.name": "فوندان الشوكولاتة الداكنة", "dish.7.desc": "قلب سائل، كراميل مملّح، آيس كريم بالفانيلا.",
      "dish.8.name": "كريم بروليه بماء الزهر", "dish.8.desc": "طبقة سكر مكرمَلة، قشور الحمضيات.",
      "dish.9.name": "ليموناضة بالنعناع", "dish.9.desc": "نعناع طازج، ليمون، ماء فوّار.",
      "dish.10.name": "قهوة مغربية بالتوابل", "dish.10.desc": "هيل، قرفة، تحميص غامق.",

      "gallery.eyebrow": "معرضنا",
      "gallery.title": "لمحة عن عالمنا",
      "gallery.desc": "من النار المكشوفة إلى آخر طبق — لحظات من قاعة الطعام والمطبخ والتراس.",
      "gallery.instagram": "تابعونا على إنستغرام",
      "gallery.open": "فتح الصورة: {caption}",
      "gallery.1.caption": "أجواؤنا الدافئة", "gallery.1.alt": "قاعة طعام دافئة بإضاءة هادئة",
      "gallery.2.caption": "مكوّنات طازجة", "gallery.2.alt": "خضار طازجة تُحضَّر على لوح خشبي",
      "gallery.3.caption": "خلف طاولة التقديم", "gallery.3.alt": "الطاهي يزيّن طبقًا في المطبخ",
      "gallery.4.caption": "مطهوّ على النار", "gallery.4.alt": "لحم يُشوى على نار مكشوفة",
      "gallery.5.caption": "أمسيات على التراس", "gallery.5.alt": "جلسة التراس الخارجية عند الغروب",
      "gallery.6.caption": "خاتمة حلوة", "gallery.6.alt": "لقطة قريبة لحلوى جاهزة",

      "testi.eyebrow": "آراء الضيوف",
      "testi.title": "ماذا يقول ضيوفنا",
      "testi.desc": "كلمات من ضيوف يعودون دائمًا لطلب المزيد — وأكثر.",
      "testi.review": "التقييم {n}",
      "testi.stars": "5 من 5 نجوم",
      "testi.prev": "التقييم السابق", "testi.next": "التقييم التالي",
      "testi.1.quote": "«كتف الخروف وحده يستحق الرحلة — يتفتّت بمجرد أن تلمسه الشوكة. أصبح هذا مكاننا المفضّل في كل مناسبة سنوية.»",
      "testi.2.quote": "«أفضل حلّوم في المدينة دون منازع. تذكّر الطاقم طلبنا من المرة السابقة — هذا هو طابع المكان.»",
      "testi.3.quote": "«مكان دافئ ومريح، وكان طبق الأخطبوط المقبّل رائعًا. جئنا لعشاء سريع وبقينا من أجل الحلوى — كل ما جرّبناه كان ممتازًا.»",
      "testi.4.quote": "«حجزنا عبر واتساب في دقيقتين وكانت طاولتنا جاهزة في الموعد تمامًا. ريزوتو القرع لذيذ لدرجة لا تُصدَّق.»",
      "testi.5.quote": "«دخلنا المكان صدفة خلال رحلة إلى سلا، وانتهى بنا الأمر بالعودة ثلاث ليالٍ متتالية. التراس عند الغروب لا يُضاهى.»",
      "testi.role.regular": "ضيف دائم", "testi.role.local": "زبون محلي دائم", "testi.role.first": "زيارة أولى", "testi.role.travel": "ضيف مسافر",

      "about.alt": "قاعة الطعام والمطبخ المفتوح في Maison Braise",
      "about.since": "منذ",
      "about.eyebrow": "من نحن",
      "about.title": "حكاية شغف ونكهة",
      "about.p1": "افتتح Maison Braise أبوابه عام 2010 بفكرة بسيطة: أن نطهو كل شيء على النار الحيّة، ونختار مكوّناتنا من المنطقة المحيطة، ونترك الناس يطيلون الجلوس إلى المائدة.",
      "about.p2": "ما بدأ كمشوى صغير في الحي صار مكانًا للقاء — لكن المطبخ ما زال يسير على الإيقاع نفسه: جولة في السوق عند الفجر، وطهي بطيء طوال فترة ما بعد الظهر، وآخر طبق يغادر المطبخ بعد منتصف الليل بوقت طويل.",
      "about.h1": "مكوّنات محلية طازجة", "about.h2": "وصفات تقليدية بلمسة جديدة", "about.h3": "أجواء دافئة ومريحة",
      "about.discover": "اكتشف المزيد",
      "stat.years": "سنوات من الخبرة", "stat.dishes": "طبق في القائمة", "stat.customers": "زبون سعيد", "stat.rating": "متوسط التقييم",
      "team.eyebrow": "فريقنا",
      "team.title": "تعرّفوا على الطهاة وراء النار",
      "team.1.role": "الطاهي التنفيذي والمؤسس", "team.2.role": "مساعدة الطاهي الرئيسي", "team.3.role": "أستاذ الشواء",
      "team.1.bio": "عشرون عامًا أمام الشواية، من مطابخ مراكش إلى ليون. ما زال يُشعل النار الأولى كل صباح.",
      "team.2.bio": "تُدير طاولة التقديم بهدوء ودقة، وتبني قائمتنا الموسمية على ما يجلبه السوق عند الفجر.",
      "team.3.bio": "سيّد الحطب والدخان والصبر — السبب في أن لحم الخروف عندنا يتفتّت بلمسة شوكة.",
      "team.1.alt": "صورة الطاهي ياسين أمراني", "team.2.alt": "صورة الطاهية سلمى بنجلون", "team.3.alt": "صورة الطاهي كريم الوزاني",
      "about.quote": "«اطهُ بالنار، واطهُ بصبر، وسيتكفّل الباقي بنفسه.»",
      "about.quoteBy": "الطاهي ياسين أمراني، المؤسس",

      "contact.eyebrow": "تواصل معنا",
      "contact.title": "زورونا أو تواصلوا معنا",
      "contact.desc": "احجزوا طاولة أو اطرحوا سؤالًا أو ألقوا التحية فقط — سنردّ عليكم في أقرب وقت.",
      "hours.title": "ساعات العمل",
      "hours.weekdays": "الاثنين – الخميس", "hours.weekend": "الجمعة – الأحد",
      "contact.addressTitle": "العنوان",
      "contact.address": "123 شارع محمد السادس، سلا، المغرب",
      "contact.directions": "احصل على الاتجاهات",
      "contact.callTitle": "اتصل أو راسل أو أرسل بريدًا",
      "form.name": "الاسم", "form.phone": "الهاتف", "form.date": "التاريخ", "form.time": "الوقت", "form.guests": "عدد الأشخاص",
      "form.select": "اختر…",
      "form.datePlaceholder": "اختر تاريخًا", "form.timePlaceholder": "اختر وقتًا",
      "form.err.name": "يرجى إدخال اسمك.",
      "form.err.phone": "يرجى إدخال رقم هاتف صحيح.",
      "form.err.date": "يرجى اختيار تاريخ متاح.",
      "form.err.sunday": "الحجز عبر الإنترنت غير متاح أيام الأحد.",
      "form.err.time": "يرجى اختيار الوقت.",
      "form.err.timePast": "يرجى اختيار وقت لاحق اليوم.",
      "form.err.guests": "يرجى اختيار عدد الأشخاص.",
      "form.send": "إرسال عبر واتساب",
      "map.title": "خريطة موقع المطعم",

      "footer.tagline": "طعام مطهوّ على النار، وأمسيات دافئة، وطاولة جاهزة لكم دائمًا.",
      "footer.quick": "روابط سريعة",
      "footer.contact": "تواصل معنا",
      "footer.checking": "جارٍ التحقق من الساعات…",
      "footer.open": "مفتوح الآن",
      "footer.closed": "مغلق الآن",
      "footer.rights": "Maison Braise. جميع الحقوق محفوظة.",
      "footer.privacy": "سياسة الخصوصية", "footer.terms": "شروط الخدمة",
      "social.follow": "تابعونا على {n}",

      "lightbox.close": "إغلاق", "lightbox.prev": "الصورة السابقة", "lightbox.next": "الصورة التالية",
      "fab.reserve": "احجز طاولة عبر واتساب",
      "fab.top": "العودة إلى الأعلى",

      "wa.reserve": "مرحبًا Maison Braise، أودّ حجز طاولة.",
      "wa.menu": "مرحبًا Maison Braise، هل يمكنكم إرسال القائمة الكاملة من فضلكم؟",
      "wa.info": "مرحبًا Maison Braise، أودّ الحصول على بعض المعلومات.",
      "wa.order": "مرحبًا، أودّ طلب: {name} ({price} {cur})",

      "res.hello": "مرحبًا Maison Braise،",
      "res.intro": "أودّ حجز طاولة:",
      "res.name": "الاسم:", "res.phone": "الهاتف:", "res.date": "التاريخ:", "res.time": "الوقت:", "res.guests": "عدد الأشخاص:",
      "res.six": "6 أو أكثر",
      "res.thanks": "يرجى تأكيد التوفر، شكرًا لكم."
    }
  };

  /* =============================================================
     LANGUAGE DETECTION & STORAGE
     ============================================================= */
  function isSupported(lang) {
    return SUPPORTED_LANGS.indexOf(lang) !== -1;
  }

  function readStored() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function writeStored(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked: choice just won't persist */ }
  }

  /** Priority: ?lang= in the URL → saved choice → browser language → English. */
  function detectLanguage() {
    var fromUrl = null;
    try { fromUrl = new URLSearchParams(window.location.search).get("lang"); } catch (e) { /* old browser */ }
    if (fromUrl && isSupported(fromUrl.toLowerCase())) return fromUrl.toLowerCase();

    var stored = readStored();
    if (stored && isSupported(stored)) return stored;

    var preferred = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < preferred.length; i++) {
      var code = String(preferred[i]).slice(0, 2).toLowerCase();
      if (isSupported(code)) return code;
    }
    return DEFAULT_LANG;
  }

  function dirFor(lang) {
    return RTL_LANGS.indexOf(lang) !== -1 ? "rtl" : "ltr";
  }

  /* =============================================================
     CORE
     ============================================================= */
  var currentLang = detectLanguage();

  /* Set lang/dir immediately (we are in <head>) so the first paint is
     already correct, and load the matching Bootstrap build. */
  document.documentElement.lang = currentLang;
  document.documentElement.dir = dirFor(currentLang);
  document.write(
    '<link id="bootstrapCss" rel="stylesheet" href="' +
    (dirFor(currentLang) === "rtl" ? BOOTSTRAP_RTL : BOOTSTRAP_LTR) + '">'
  );

  /**
   * Translate a key. Falls back to English, then to the key itself.
   * @param {string} key
   * @param {Object} [vars]  values for {placeholders}
   * @param {string} [langOverride]  translate into another language than the current one
   */
  function t(key, vars, langOverride) {
    var lang = langOverride && isSupported(langOverride) ? langOverride : currentLang;
    var text = I18N_DATA[lang] && I18N_DATA[lang][key];
    if (text === undefined) text = I18N_DATA[DEFAULT_LANG][key];
    if (text === undefined) return key;
    if (vars) {
      text = text.replace(/\{(\w+)\}/g, function (match, name) {
        return vars[name] !== undefined ? vars[name] : match;
      });
    }
    return text;
  }

  function varsFromElement(el) {
    return el.dataset.i18nN !== undefined ? { n: el.dataset.i18nN } : undefined;
  }

  /** Translates every [data-i18n] / [data-i18n-attr] element under root. */
  function applyTranslations(root) {
    root = root || document;

    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.dataset.i18n, varsFromElement(el));
    });

    root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.dataset.i18nAttr.split(";").forEach(function (pair) {
        var parts = pair.split(":");
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim(), varsFromElement(el)));
      });
    });
  }

  function setMeta(selector, attribute, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute(attribute, value);
  }

  function updateDocumentMeta() {
    document.title = t("meta.title");
    setMeta('meta[name="description"]', "content", t("meta.desc"));
    setMeta('meta[property="og:title"]', "content", t("meta.title"));
    setMeta('meta[property="og:description"]', "content", t("meta.ogdesc"));
  }

  function updateSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === currentLang));
    });
  }

  /** Swaps the LTR/RTL Bootstrap build without a flash of unstyled content. */
  function swapBootstrap(dir) {
    var oldLink = document.getElementById("bootstrapCss");
    if (!oldLink) return;

    var wanted = dir === "rtl" ? BOOTSTRAP_RTL : BOOTSTRAP_LTR;
    if (oldLink.getAttribute("href") === wanted) return;

    var newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = wanted;
    newLink.onload = function () {
      oldLink.remove();
      newLink.id = "bootstrapCss";
    };
    oldLink.parentNode.insertBefore(newLink, oldLink.nextSibling);
  }

  /** Switches the whole page to another language. */
  function setLanguage(lang, options) {
    if (!isSupported(lang)) return;
    var persist = !options || options.persist !== false;

    var changed = lang !== currentLang;
    currentLang = lang;
    var dir = dirFor(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    swapBootstrap(dir);

    applyTranslations();
    updateDocumentMeta();
    updateSwitcher();
    if (persist) writeStored(lang);

    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: lang, dir: dir, changed: changed } }));
  }

  function initSwitcher() {
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.dataset.lang);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    updateDocumentMeta();
    updateSwitcher();
    initSwitcher();
  });

  /* Public API used by script.js */
  window.I18N = {
    t: t,
    setLanguage: setLanguage,
    get lang() { return currentLang; },
    get dir() { return dirFor(currentLang); },
    get isRTL() { return dirFor(currentLang) === "rtl"; },
    supported: SUPPORTED_LANGS.slice()
  };
})();
