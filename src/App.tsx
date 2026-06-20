/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef, RefObject } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Languages, 
  Book, 
  Compass, 
  Menu, 
  X, 
  ArrowUp, 
  Heart, 
  Lightbulb, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Clock, 
  Award,
  ChevronRight,
  ExternalLink,
  Image,
  Maximize2,
  Download,
  Youtube,
  FileText
} from 'lucide-react';
import { biographyChapters, booksList } from './data';
import { BiographyChapter, BookItem, BookCategory } from './types';

// Milestone transitions placed between chapters in the Jeevani section
const milestones = [
  {
    afterChapter: 1,
    year: "1923",
    titleHindi: "आत्मनिर्भर श्रम व सेवा का सहज अवलोकन",
    titleEnglish: "Observations of Self-Reliance & Dignity",
    descriptionHindi: "अग्रहार ग्राम की आर्थिक आत्मनिर्भरता, सेवा-परंपरा और अयाचित दान की प्रणाली ने उनके बालमन में मानवीय गरिमा व सम्मान का प्रारंभिक मूल्य स्थापित किया।",
    descriptionEnglish: "Witnessing village self-reliance and guest-service traditions silently sowed seminal seeds of human dignity and unbiased respect in young Nagraj."
  },
  {
    afterChapter: 2,
    year: "1932",
    titleHindi: "जनेऊ का विसर्जन और छुआछूत का विरोध",
    titleEnglish: "Renouncing Caste Borders & Rituals",
    descriptionHindi: "अपने परम बालसखा दासप्पा को छूने पर मिली पारिवारिक प्रताड़ना से आहत होकर, सनातन पवित्र धागे (जनेऊ) का परित्याग किया और छुआछूत को सदैव के लिए नकारा।",
    descriptionEnglish: "Deeply shaken by childhood experiences of untouchability toward his playmate Dasappa, he renounced the sacred thread (Janeu) and forever dismissed caste segregation."
  },
  {
    afterChapter: 3,
    year: "1938",
    titleHindi: "स्वावलंबन: शारीरिक श्रम व औषधीय ज्ञान का समन्वय",
    titleEnglish: "Mastery of Self-Sustaining Vocational Crafts",
    descriptionHindi: "औपचारिक स्कूली शिक्षा से आगे बढ़ते हुए माताजी के संग जड़ी-बूटियों की पहचान, संगीत (वीणा), बढ़ईगीरी और लोहारी जैसी उत्पादक विधाओं को जीवनपरक रूप में सीखा।",
    descriptionEnglish: "Venturing beyond formal schooling, he learned traditional medicine, classical music, carpentry, and smithing, championing manual labor as a source of understanding."
  },
  {
    afterChapter: 4,
    year: "1942",
    titleHindi: "शृंगेरी पीठ में वेदमूर्ति संवाद",
    titleEnglish: "Critical Scriptural Inquiry with Sringeri Jagadguru",
    descriptionHindi: "वेदांत दर्शन और 'अनिर्वचनीय ब्रह्म' की व्याख्याओं पर शृंगेरी के शंकराचार्य चंद्रशेखर भारती जी के साथ सघन संवाद, जहाँ शास्त्रों की सीमाओं का तीव्र भान हुआ।",
    descriptionEnglish: "Engaging in intensive philosophical dialogs with Sringeri Shankaracharya regarding contradictions in scriptures, realizing that bookish descriptions cannot replace living validation."
  },
  {
    afterChapter: 5,
    year: "1946",
    titleHindi: "काशी की स्वावलंबी साधना और पाणिग्रहण",
    titleEnglish: "Tailoring in Kashi & Grist (Grahast) Order",
    descriptionHindi: "काशी प्रवास में बिना परजीवी भोजन के स्वाभिमान से जीने हेतु सिलाई कला सीखी। वापस लौटकर पूज्य गुरु व माताजी की सहमति से श्रीमती नागरत्ना जी से विवाह संपन्न किया।",
    descriptionEnglish: "Supported himself via tailoring in Kashi. Returned to marry Smt. Nagarathna, who eagerly embraced his quest, choosing a life of simple toil over luxury."
  },
  {
    afterChapter: 6,
    year: "1949",
    titleHindi: "अंतिम प्रस्थान हेतु गुरु का आशीष और पत्नी का वज्रसंकल्प",
    titleEnglish: "The Sacred Departure and Shared Will for Samadhi",
    descriptionHindi: "नर्मदा तट पर समाधि साधना के लिए प्रस्थान करने से पहले पत्नी नागरत्ना जी व माताजी से अनमोल सहमति प्राप्त की, और शृंगेरी गुरुदेव से पूर्ण आशीर्वाद ग्रहण किया।",
    descriptionEnglish: "Securing his wife's supportive dedication and Shankaracharya's blessings, he left his ancestral village to commence absolute experiential inquiry in Amarkantak."
  },
  {
    afterChapter: 7,
    year: "1955",
    titleHindi: "मौन, अनाकर्षण और कठोर शारीरिक तपश्चर्या",
    titleEnglish: "Decade of Secluded Meditation near Narmada",
    descriptionHindi: "अमरकंटक की निर्जन वादियों में रामबाई धर्मशाला के पास जनसंपर्क शून्य कर, प्रतिदिन १२ से १८ घंटे एक ही आसन पर बैठकर समाधि का निरंतर अभ्यास किया।",
    descriptionEnglish: "Retreating to Amarkantak, he limited social ties to zero, disciplining himself to sit for 12 to 18 hours daily, channeling intellectual energy into complete silence."
  },
  {
    afterChapter: 8,
    year: "1970",
    titleHindi: "सह-अस्तित्व सत्य का साक्षात् बोध (संयम क्रिया)",
    titleEnglish: "Samyama: Realizing Co-existence (Saha-Astitva)",
    descriptionHindi: "कठोर तप और चरम समाधि के बाद 'संयम' क्रिया संपन्न की, जिसके फलस्वरूप संपूर्ण मूल अस्तित्व, विकासक्रम और मानवीय जागृति का रहस्य सहजता से निरूपित हुआ।",
    descriptionEnglish: "Progressing from mental static (Samadhi) to dynamic activation (Samyama), he witnessed the ultimate co-existential framework of reality, free of magical dogma."
  },
  {
    afterChapter: 9,
    year: "1979",
    titleHindi: "मध्यस्थ दर्शन के चार दर्शन व तीन वादों का लेखन",
    titleEnglish: "Drafting the Philosophical Frameworks",
    descriptionHindi: "अपने परम अनुभव को तार्किक व मानवीय भाषा देने हेतु 'मानव व्यवहार दर्शन' सहित ४ दर्शनों, ३ वादों और ३ शास्त्रों को अमरकंटक में लिपिबद्ध करना प्रारंभ किया।",
    descriptionEnglish: "Refusing to wrap his realization in esoteric riddles, he began drafting the 4 Darshans, 3 Vadas, and 3 Shastras, building a transparent study system."
  },
  {
    afterChapter: 10,
    year: "1995",
    titleHindi: "अछोटी संस्थान (रायपुर) की स्थापना व शिक्षा में मूल्यप्रसार",
    titleEnglish: "Value-based Education and Model Collective Living",
    descriptionHindi: "सामूहिक स्वावलंबन हेतु अभ्युदय संस्थान (अछोटी) की सफल नींव रखी, जहाँ सैकड़ों शिक्षाविदों व वैज्ञानिकों ने दर्शन आधारित जीवन पद्धति का प्रत्यक्ष अवलोकन किया।",
    descriptionEnglish: "Founded Abhyudaya Sansthan at Achhoti to demonstrate harmonious, collective co-living. Dialogued with leading university vice-chancellors to introduce value education."
  }
];

interface TimelineConnectorProps {
  chapterId: number;
  englishVisible: boolean;
}

function TimelineConnector({ chapterId, englishVisible }: { chapterId: number; englishVisible: boolean }) {
  const milestone = milestones.find(m => m.afterChapter === chapterId);
  if (!milestone) return null;

  return (
    <div className="relative my-10 flex flex-col items-center">
      {/* SVG Connecting Track & Pulsing Marker */}
      <div className="relative w-full flex flex-col items-center">
        {/* Top Connecting Line */}
        <div className="w-0.5 h-14 bg-gradient-to-b from-ivory-200 via-clay-600/20 to-clay-600/40" />
        
        {/* Interactive SVG Node */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-120px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex items-center justify-center -my-1 group"
        >
          {/* Animated SVG Outer Glowing circle */}
          <svg width="44" height="44" viewBox="0 0 44 44" className="text-ochre-600 drop-shadow-sm">
            {/* Pulsing outer ring */}
            <circle 
              cx="22" 
              cy="22" 
              r="15" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeDasharray="4 2" 
              className="origin-center animate-[spin_30s_linear_infinite]" 
            />
            {/* Soft backdrop */}
            <circle cx="22" cy="22" r="11" fill="#FDFBF7" stroke="currentColor" strokeWidth="2.5" />
            {/* Center dot */}
            <circle cx="22" cy="22" r="4.5" fill="currentColor" className="group-hover:scale-125 transition-transform" />
          </svg>
          
          {/* Timeline Floating Year Badge bubble */}
          <div className="absolute -right-16 bg-clay-900 border border-ochre-600/30 text-ivory-100 font-mono text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
            {milestone.year}
          </div>
        </motion.div>
        
        {/* Bottom Connecting Line */}
        <div className="w-0.5 h-14 bg-gradient-to-b from-clay-600/40 via-clay-600/20 to-ivory-200" />
      </div>

      {/* Milestone Card - Editorial Aesthetic Style */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-120px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full mt-5 bg-ivory-100/40 border border-ivory-200/60 rounded-xl p-5 md:p-6 shadow-inner hover:bg-ivory-100/70 transition-all duration-300 relative text-center group"
      >
        <div className="absolute top-2.5 left-3 text-[9px] uppercase tracking-widest text-clay-400 font-serif opacity-60">
          समयरेखा मील का पत्थर (Timeline Milestone)
        </div>
        
        <div className="mt-1.5 flex justify-center items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-ochre-600 uppercase tracking-widest bg-ochre-600/10 px-2 py-0.5 rounded">
            {milestone.year}
          </span>
          <span className="w-1 h-1 rounded-full bg-clay-400" />
          <span className="font-serif text-xs text-clay-500 uppercase tracking-wider font-semibold">
            संक्रमण काल (Transition Period)
          </span>
        </div>
        
        <h4 className="font-serif text-base md:text-lg font-bold text-clay-900 mt-3 mb-1.5 leading-snug group-hover:text-ochre-600 transition-colors">
          {milestone.titleHindi}
        </h4>
        
        {englishVisible && (
          <p className="font-serif text-xs md:text-sm text-clay-600 italic tracking-wide mb-3 leading-normal max-w-xl mx-auto">
            {milestone.titleEnglish}
          </p>
        )}
        
        <p className="font-hindi text-sm text-clay-800 leading-[1.7] text-justify max-w-xl mx-auto py-2 border-t border-b border-ivory-200/30">
          {milestone.descriptionHindi}
        </p>
        
        {englishVisible && (
          <p className="font-serif text-stone-500 text-[11px] leading-relaxed text-justify max-w-xl mx-auto italic mt-2.5">
            {milestone.descriptionEnglish}
          </p>
        )}
      </motion.div>
    </div>
  );
}

interface GalleryItem {
  id: number;
  category: 'sadhana' | 'manuscripts' | 'dialogue';
  titleHindi: string;
  titleEnglish: string;
  descHindi: string;
  descEnglish: string;
  year: string;
  imageUrl: string;
}

const galleryImages: GalleryItem[] = [
  {
    id: 1,
    category: 'sadhana',
    titleHindi: "अमरकंटक पर्वत श्रेणियां: मौन साधना क्षेत्र",
    titleEnglish: "The Amarkantak Forests & Mountain Ranges",
    descHindi: "अमरकंटक की पवित्र पर्वत श्रेणियां जहाँ नर्मदा, सोन व जोहिला का उद्गम है। इसी प्राकृतिक शांत अंचल की सघन वनस्पतियों के मध्य श्रद्धेय नागराज जी ने २० वर्षों तक अपनी समाधि व संयम क्रिया को अनुप्रमाणित किया।",
    descEnglish: "The serene and verdant heights of Amarkantak hills, source of sacred rivers. In this natural silence, Shri A. Nagraj conducted his intensive 20-year deep experiential research.",
    year: "1950 - 1970",
    imageUrl: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    category: 'sadhana',
    titleHindi: "सघन वृक्ष तले संयम अभ्यास",
    titleEnglish: "Deep Contemplation Under the Banyan Canopy",
    descHindi: "अमरकंटक की रामबाई धर्मशाला परिसर के समीप शांत प्रकृति में संयम साधना की मुद्रा। प्रतिदिन १२ से १८ घंटे निरंतर एक ही आसन पर बैठकर सत्य का पूर्ण साक्षात्कार किया गया।",
    descEnglish: "A representational view of quietude. Spending 12 to 18 hours daily in single-posture meditation, seeking complete, repeatable truth free of mythical mysteries.",
    year: "1960",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    category: 'manuscripts',
    titleHindi: "१३ मूल ग्रंथ निर्माण",
    titleEnglish: "Penning the 13 Original Manuscripts",
    descHindi: "समाधि से प्राप्त अनुभव को तर्कसंगत भाषा प्रदान करने का काल। नागराज जी ने अपने हस्तलेखों में संपूर्ण ब्रह्मांडीय नियमों, मानव आचरण और सह-अस्तित्व की तार्किक व्याख्या को लिपिवद्ध किया।",
    descEnglish: "Penning experiential truth into rational discourse. He manually wrote detailed explanations of universal dynamics, human conduct, and nature's structures.",
    year: "1975 - 1980",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    category: 'dialogue',
    titleHindi: "अस्तित्व सह-अस्तित्व संवाद गोष्ठी",
    titleEnglish: "Dialogues on Absolute Co-existence",
    descHindi: "विश्व के विभिन्न भागों से आए मनीषियों, जिज्ञासुओं और युवा छात्रों के साथ संवाद। अमरकंटक में नागराज जी की उपस्थिति में मानवीय गरिमा और सह-अस्तित्व पर निरंतर संवाद सत्र आयोजित होते थे।",
    descEnglish: "Collective dialogue and sharing with intellectuals, seekers, and students under green canopies, translating experienced philosophy into everyday understanding.",
    year: "1985 - 1995",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    category: 'sadhana',
    titleHindi: "अमरकंटक आश्रम का प्रशांत परिसर",
    titleEnglish: "The Peaceful Environs of Amarkantak Ashram",
    descHindi: "जहाँ जीवन विद्या के प्रथम पाठ और स्वावलंबी कृषि, गोपालन के व्यावहारिक अभ्यास का आरंभ हुआ। यह स्थल आज भी साधकों के लिए स्वावलंबन और समझ का प्रेरणा केंद्र है।",
    descEnglish: "The pristine ashram environment. It functioned as a school of self-reliance, organic cultivation, and husbandry alongside philosophical inquiry.",
    year: "1975",
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    category: 'manuscripts',
    titleHindi: "शब्दावली निर्माण एवं मूल शोध",
    titleEnglish: "Defining Spiritual Vocabulary & Taxonomy",
    descHindi: "रहस्यवाद व भौतिकवाद से परे मध्यस्थ दर्शन के पारिभाषिक शब्दों का अद्भुत संग्रह। नागराज जी ने प्रत्येक मानवीय क्रिया और प्राकृतिक तत्वों की सघन व्याख्या हेतु अभिनव शब्दावली सृजित की।",
    descEnglish: "Forging dynamic conceptual definitions. He created a custom vocabulary to describe the subtle differences between body, consciousness, and eternal materials.",
    year: "1980",
    imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024addd?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'jeevani' | 'sahitya'>('jeevani');
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [englishTranslationVisible, setEnglishTranslationVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'sadhana' | 'manuscripts' | 'dialogue'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFrameworkTab, setActiveFrameworkTab] = useState<'whatIs' | 'alternative' | 'threePoints' | 'coexistence' | 'studyMaterial'>('whatIs');

  const filteredGalleryImages = useMemo(() => {
    if (galleryFilter === 'all') return galleryImages;
    return galleryImages.filter((img) => img.category === galleryFilter);
  }, [galleryFilter]);

  // Handle lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // References for smooth scrolling
  const jeevaniRef = useRef<HTMLDivElement>(null);
  const sahityaRef = useRef<HTMLDivElement>(null);
  const chaptersContainerRef = useRef<HTMLDivElement>(null);

  // Auto detect active chapter during scroll
  useEffect(() => {
    const handleScroll = () => {
      // 1. Scroll-to-top button visibility
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // 2. Reading progress calculation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // 3. Highlight current chapter on scroll (Only relevant on 'jeevani' page)
      const chapters = document.querySelectorAll('.biography-chapter-node');
      let currentChapterId = 1;
      chapters.forEach((node) => {
        const rect = node.getBoundingClientRect();
        // If the top of the chapter node is near or above the center of viewport
        if (rect.top <= window.innerHeight * 0.45) {
          const idAttr = node.getAttribute('data-id');
          if (idAttr) {
            currentChapterId = parseInt(idAttr, 10);
          }
        }
      });
      setActiveChapter(currentChapterId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter books list
  const filteredBooks = useMemo(() => {
    return booksList.filter((book) => {
      const matchCategory = selectedCategory === 'all' || book.category === selectedCategory;
      const matchQuery = 
        book.titleHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.translationEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.descriptionHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.descriptionEnglish.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Page routing and navigation helper to support truly separate pages
  const navigateToPage = (tab: 'jeevani' | 'sahitya') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToChapter = (id: number) => {
    setActiveChapter(id);
    if (activeTab !== 'jeevani') {
      setActiveTab('jeevani');
      setTimeout(() => {
        const element = document.getElementById(`chapter-${id}`);
        if (element) {
          const yOffset = -100; // offset for header + sticky subheader
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(`chapter-${id}`);
      if (element) {
        const yOffset = -100; // offset for header + sticky subheader
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const getCategoryTheme = (category: BookCategory) => {
    switch (category) {
      case 'darshan':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'दर्शन (Philosophical)' };
      case 'vada':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'वाद (Ideological)' };
      case 'shastra':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'शास्त्र (Scientific)' };
      case 'samvidhan':
        return { bg: 'bg-orange-50 text-orange-800 border-orange-200', label: 'संविधान (Constitution)' };
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-clay-800 flex flex-col selection:bg-ochre-600 selection:text-white">
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-ochre-600/40 z-50 transition-all duration-100 origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {/* Decorative Traditional Border Header Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-ochre-600 via-clay-800 to-ochre-600 sticky top-0 z-40" />

      {/* Sticky Premium Header */}
      <header className="sticky top-1 bg-ivory-50/90 backdrop-blur-md border-b border-ivory-200 px-4 md:px-8 py-3.5 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-hindi font-bold tracking-tight text-clay-900 text-base md:text-lg">श्री ए. नागराज</h1>
              <p className="font-hindi text-[10px] md:text-xs tracking-wide text-clay-600">प्रणेता: मध्यस्थ दर्शन</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button 
              id="nav-jeevani"
              onClick={() => navigateToPage('jeevani')}
              className={`px-4 py-2 rounded-lg font-serif transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer ${
                activeTab === 'jeevani' 
                  ? 'bg-ivory-100 text-ochre-600 font-bold border border-ivory-200' 
                  : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-100/50'
              }`}
            >
              <Compass className="w-4 h-4 text-ochre-600" />
              <span>विस्तृत जीवनी (Biography)</span>
            </button>
            <button 
              id="nav-sahitya"
              onClick={() => navigateToPage('sahitya')}
              className={`px-4 py-2 rounded-lg font-serif transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer ${
                activeTab === 'sahitya' 
                  ? 'bg-ivory-100 text-ochre-600 font-bold border border-ivory-200' 
                  : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-100/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-ochre-600" />
              <span>साहित्य (Literature)</span>
            </button>

            <span className="w-px h-6 bg-ivory-200 mx-2" />

            {/* Translation and Info Utility */}
            <button
              onClick={() => setEnglishTranslationVisible(!englishTranslationVisible)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
                englishTranslationVisible 
                  ? 'bg-ochre-600/10 text-ochre-700 border-ochre-600/20' 
                  : 'bg-ivory-100 border-ivory-200 text-clay-600 hover:text-clay-900'
              }`}
              title="Toggle English Translation of Chapter Names & Highlights"
            >
              <Languages className="w-4 h-4" />
              <span className="hidden lg:inline">{englishTranslationVisible ? "English Subtitles On" : "English Subtitles Off"}</span>
            </button>
          </nav>

          {/* Quick Mobile Language Action + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setEnglishTranslationVisible(!englishTranslationVisible)}
              className="p-2 rounded-lg bg-ivory-100 border border-ivory-200 text-clay-600"
              title="Toggle English Translation"
            >
              <Languages className="w-4 h-4" />
            </button>
            <button 
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-ivory-100 border border-ivory-200 text-clay-600 hover:text-clay-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky sub-header timeline (Only on Jeevani/Biography Tab on Mobile devices) */}
      <AnimatePresence>
        {activeTab === 'jeevani' && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden sticky top-[71px] z-35 bg-ivory-50/95 backdrop-blur-md border-b border-ivory-200/80 shadow-[0_2px_10px_-4px_rgba(140,123,101,0.15)] px-4 py-2.5 flex flex-col gap-2 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-[11px] font-bold uppercase tracking-[0.05em] text-clay-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ochre-700 animate-pulse" />
                अध्याय (Chapter) {activeChapter}/11
              </span>
              <span className="font-mono text-[9px] text-ochre-700 bg-clay-600/10 px-2 py-0.5 rounded font-bold tracking-wider">
                {biographyChapters.find(c => c.id === activeChapter)?.period || "1920"}
              </span>
            </div>
            
            {/* Horizontal Scrollable Timeline Track */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
              {biographyChapters.map((ch) => {
                const isActive = activeChapter === ch.id;
                const isPassed = activeChapter > ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => scrollToChapter(ch.id)}
                    className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-0.5 focus:outline-none cursor-pointer relative"
                  >
                    {/* Circle Node Container */}
                    <div className="relative flex items-center justify-center">
                      {/* Connection track segment to NEXT node */}
                      {ch.id < 11 && (
                        <div className={`absolute left-[13px] right-[-27px] top-1/2 -translate-y-1/2 h-[1.5px] pointer-events-none transition-colors duration-300 ${
                          isPassed ? 'bg-ochre-600/30' : 'bg-ivory-200'
                        }`} />
                      )}
                      
                      {/* Inner dot bubble selection */}
                      <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 z-10 ${
                        isActive
                          ? 'bg-clay-900 text-ivory-50 border-2 border-ochre-600 shadow-md scale-110'
                          : isPassed
                          ? 'bg-ochre-600/15 text-ochre-700 border border-ochre-600/30'
                          : 'bg-ivory-100 border border-ivory-200 text-clay-400'
                      }`}>
                        {ch.id}
                      </div>
                    </div>
                    {/* Compact Date label beneath node */}
                    <span className={`text-[8px] font-mono tracking-tighter whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-ochre-600 font-bold' : 'text-clay-500'
                    }`}>
                      {ch.period ? ch.period.split(" ")[0] : "1920"}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-clay-900/60 backdrop-blur-xs z-50 md:hidden"
            />

            {/* Slide-out Panel */}
            <motion.div
              id="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 h-full w-[85vw] max-w-[340px] bg-ivory-100 border-l border-ivory-200 shadow-2xl z-50 p-6 flex flex-col justify-between md:hidden text-clay-800"
            >
              <div className="flex flex-col flex-1 min-h-0">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-ivory-200 mb-6">
                  <div>
                    <h3 className="font-serif font-bold text-base text-clay-900">अनुक्रमणिका</h3>
                    <p className="font-sans text-[9px] tracking-widest text-clay-500 uppercase">NAVIGATION MENU</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-ivory-100 border border-ivory-200 text-clay-600 hover:text-clay-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Quick Links */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => navigateToPage('jeevani')}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-serif transition-all duration-200 border ${
                      activeTab === 'jeevani' 
                        ? 'bg-clay-900 text-ivory-50 border-clay-900 shadow-sm' 
                        : 'bg-ivory-100 border-ivory-200 text-clay-600 hover:bg-ivory-200'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-ochre-600" />
                    <span>विस्तृत जीवनी (Biography)</span>
                  </button>
                  <button 
                    onClick={() => navigateToPage('sahitya')}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-serif transition-all duration-200 border ${
                      activeTab === 'sahitya' 
                        ? 'bg-clay-900 text-ivory-50 border-clay-900 shadow-sm' 
                        : 'bg-ivory-100 border-ivory-200 text-clay-600 hover:bg-ivory-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-ochre-600" />
                    <span>साहित्य (Literature/Works)</span>
                  </button>
                </div>

                <div className="h-px bg-ivory-200 my-6" />

                {/* Quick Chapter Jump */}
                <div className="flex-1 flex flex-col min-h-0">
                  <p className="text-[10px] uppercase tracking-wider text-clay-500 font-sans font-bold mb-3">जीवन यात्रा अध्याय (Chapter Jump)</p>
                  <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 pb-4">
                    {biographyChapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToChapter(ch.id);
                        }}
                        className={`h-11 rounded-lg flex flex-col items-center justify-center font-mono transition-all duration-200 border cursor-pointer ${
                          activeChapter === ch.id 
                            ? 'bg-ochre-600 text-white border-ochre-600 shadow-md font-bold' 
                            : 'bg-ivory-100 border-ivory-200 text-clay-700 hover:bg-ivory-200'
                        }`}
                      >
                        <span className="text-xs font-bold leading-none">{ch.id}</span>
                        <span className={`text-[8px] tracking-tighter mt-1 leading-none ${activeChapter === ch.id ? 'text-ivory-100' : 'text-clay-400'}`}>
                          {ch.period ? ch.period.split(" ")[0] : "1920"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quotes / Footer block in drawer */}
              <div className="pt-4 border-t border-ivory-200 text-center">
                <p className="text-[10px] font-serif text-clay-400 italic font-semibold">"समझना ही रहने का आधार है।"</p>
                <p className="text-[8px] font-sans text-[#8C7B65] uppercase tracking-widest mt-1.5 font-bold">A. NAGRAJ • MADHYASTH DARSHAN</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 bg-gradient-to-b from-ivory-100 to-ivory-50 overflow-hidden border-b border-ivory-200">
        {/* Sanskrit Mandala SVG Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <svg className="w-[600px] h-[600px] text-clay-900 animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.1" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 48 * Math.cos((i * Math.PI) / 12)}
                y2={50 + 48 * Math.sin((i * Math.PI) / 12)}
                stroke="currentColor"
                strokeWidth="0.1"
              />
            ))}
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {activeTab === 'jeevani' ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-200/60 border border-ivory-200 text-ochre-700 font-sans text-xs uppercase tracking-widest mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-ochre-600" />
                <span>सत्य की खोज और समाधान का मार्ग</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="font-hindi text-5xl md:text-7xl font-bold tracking-tight text-clay-900 mb-6 leading-tight"
              >
                श्री ए. नागराज
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-hindi text-xl md:text-3xl font-light text-clay-600 mb-8 max-w-2xl mx-auto"
              >
                प्रणेता: मध्यस्थ दर्शन सह-अस्तित्ववाद
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-24 h-0.5 bg-gradient-to-r from-transparent via-ochre-600 to-transparent mx-auto mb-10"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-hindi text-lg md:text-2xl text-clay-800 leading-relaxed max-w-3xl mx-auto font-light leading-8"
              >
                “चमत्कार और संप्रदायों के रहस्यों से परे, मानव के सुखमय जीने का एक यथार्थवादी, सार्वभौमिक एवं विवेकपूर्ण प्रस्ताव।”
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-serif text-xs md:text-sm text-clay-600 tracking-wider mt-4 italic uppercase font-light"
              >
                — Proposal for human understanding, co-existence and universal values
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-4 mt-12"
              >
                <button
                  onClick={() => navigateToPage('jeevani')}
                  className="px-6 py-3 rounded-lg bg-clay-900 text-ivory-50 hover:bg-clay-800 transition shadow-md font-serif text-sm flex items-center gap-2 cursor-pointer border border-clay-900"
                >
                  <Compass className="w-4 h-4 text-ochre-600" />
                  <span>जीवन गाथा पढ़ें (Read Biography)</span>
                </button>
                <button
                  onClick={() => navigateToPage('sahitya')}
                  className="px-6 py-3 rounded-lg bg-transparent hover:bg-ivory-200/50 text-clay-900 border border-ivory-200 transition font-serif text-sm flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-ochre-600" />
                  <span>साहित्य देखें (Explore Literature)</span>
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ochre-600/10 border border-ochre-600/20 text-ochre-700 font-hindi text-xs mb-6"
              >
                <BookOpen className="w-3.5 h-3.5 text-ochre-600" />
                <span>१३ मूल वाङ्गमय ग्रंथ (The 13 Core Volumes)</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="font-hindi text-4xl md:text-6xl font-bold tracking-tight text-clay-900 mb-4 leading-tight"
              >
                मध्यस्थ दर्शन सह-अस्तित्ववाद
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="font-hindi text-2xl md:text-3xl font-normal text-clay-700 mb-3 max-w-3xl mx-auto"
              >
                अस्तित्व मूलक मानव केंद्रित चिंतन
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="font-hindi text-base md:text-lg text-clay-500 mb-8 max-w-2xl mx-auto"
              >
                श्री ए. नागराज जी द्वारा प्रतिपादित एवँ लिखित
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.45 }}
                className="w-24 h-0.5 bg-gradient-to-r from-transparent via-ochre-600 to-transparent mx-auto mb-10"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="bg-ivory-100/90 border border-ivory-200 rounded-2xl py-6 px-8 max-w-2xl mx-auto shadow-sm"
              >
                <p className="font-hindi text-xl md:text-2xl text-clay-900 font-bold leading-relaxed">
                  “अस्तित्व सह-अस्तित्व है। यही परम सत्य है।”
                </p>
                <p className="font-serif text-xs text-clay-500 tracking-wider mt-2.5 font-light uppercase">
                  — Existence is Co-existence. This is the Ultimate Truth.
                </p>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-12 overflow-visible">
        <AnimatePresence mode="wait">
          {activeTab === 'jeevani' ? (
            <motion.div
              key="biography-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Section 1: Biography / Jeevani */}
              <section 
                id="jeevani-section" 
                ref={jeevaniRef} 
                className="pt-4"
              >
                {/* Section Divider with Label */}
                <div className="flex items-center gap-4 mb-16">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-clay-900 flex items-center gap-2">
                    <span>विस्तृत जीवनी (Biography)</span>
                  </h2>
                  <div className="flex-1 h-px bg-ivory-200" />
                  <span className="font-sans text-[10px] tracking-widest text-clay-600 uppercase hidden md:inline">Chronology of Truth Journey</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                  {/* Desktop Left-Sticky Navigation Sidebar with SVG Timeline */}
                  <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-ivory-100/50 border border-ivory-200 rounded-xl p-4 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-ivory-200">
                      <Clock className="w-4 h-4 text-ochre-700 animate-pulse" />
                      <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-clay-500">जीवन यात्रा (Timeline)</h3>
                    </div>
                    
                    <div className="relative pl-5 text-xs">
                      {/* SVG Active Scroll Progress Line */}
                      <div className="absolute left-[8.5px] top-4 bottom-4 w-0.5 pointer-events-none">
                        {/* Subtle Background Track */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          <line x1="0.5" y1="0" x2="0.5" y2="100%" stroke="#E8E4D8" strokeWidth="1.5" strokeDasharray="3 3" />
                          {/* Glowing Active Dynamic Progress segment */}
                          <motion.line 
                            x1="0.5" 
                            y1="0" 
                            x2="0.5" 
                            y2={`${((activeChapter - 1) / 10) * 100}%`} 
                            stroke="#8C7B65" 
                            strokeWidth="2.5" 
                            transition={{ type: "spring", stiffness: 60, damping: 15 }}
                          />
                        </svg>
                      </div>
                      
                      <ul className="space-y-4">
                        {biographyChapters.map((ch) => {
                          const isActive = activeChapter === ch.id;
                          const isPassed = activeChapter > ch.id;
                          return (
                            <li key={ch.id} className="relative group">
                              {/* Dynamic SVG Pin Markers representing chapters */}
                              <div className="absolute -left-[22px] top-2 z-10 flex items-center justify-center bg-ivory-50 rounded-full w-[14px] h-[14px]">
                                {isActive ? (
                                  <svg width="14" height="14" viewBox="0 0 12 12" className="text-ochre-600 drop-shadow-sm">
                                    <circle cx="6" cy="6" r="5" fill="#FDFBF7" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="6" cy="6" r="2" fill="currentColor" className="animate-ping absolute" />
                                    <circle cx="6" cy="6" r="2.2" fill="currentColor" />
                                  </svg>
                                ) : isPassed ? (
                                  <svg width="10" height="10" viewBox="0 0 10 10" className="text-ochre-600">
                                    <circle cx="5" cy="5" r="4" fill="currentColor" />
                                  </svg>
                                ) : (
                                  <svg width="10" height="10" viewBox="0 0 10 10" className="text-clay-300 group-hover:text-clay-500 transition-colors">
                                    <circle cx="5" cy="5" r="3.5" fill="#FDFBF7" stroke="currentColor" strokeWidth="1.2" />
                                  </svg>
                                )}
                              </div>

                              {/* Navigation Milestone Button */}
                              <button
                                onClick={() => scrollToChapter(ch.id)}
                                className={`w-full text-left pl-3 pr-2 py-2 rounded-lg transition-all duration-200 flex flex-col cursor-pointer ${
                                  isActive
                                    ? 'bg-clay-900 text-ivory-50 font-medium shadow-sm border border-clay-900'
                                    : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-200/40 border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 w-full min-w-0">
                                  <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    isActive ? 'bg-ochre-600/35 text-white' : 'bg-ivory-200 text-clay-700'
                                  }`}>
                                    {ch.period || "1920"}
                                  </span>
                                  <span className="font-serif font-bold truncate flex-grow leading-normal">{ch.titleHindi}</span>
                                </div>
                                {englishTranslationVisible && (
                                  <span className={`text-[10px] mt-0.5 truncate leading-tight w-full block ${
                                    isActive ? 'text-ochre-200' : 'text-clay-400 group-hover:text-clay-500'
                                  }`}>
                                    {ch.titleEnglish}
                                  </span>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </aside>

                  {/* Chapters Interactive Narrative Panels */}
                  <div className="col-span-1 lg:col-span-9 space-y-16" ref={chaptersContainerRef}>
                    {biographyChapters.map((ch) => (
                      <div key={ch.id}>
                        <div 
                          id={`chapter-${ch.id}`}
                          data-id={ch.id}
                          className="biography-chapter-node bg-ivory-100 border border-ivory-200/80 rounded-2xl p-6 md:p-10 shadow-sm relative transition-all duration-300 hover:shadow-md"
                        >
                        {/* Subtle Top-Right Floating Year Badge */}
                        {ch.period && (
                          <span className="absolute top-4 right-4 md:top-6 md:right-8 px-3 py-1 rounded-full bg-ivory-100 border border-ivory-200 text-ochre-600 font-mono text-xs font-semibold">
                            {ch.period}
                          </span>
                        )}

                        {/* Chapter Header */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="font-mono text-xs font-bold text-ochre-600 bg-ochre-600/10 px-2.5 py-1 rounded">
                              अध्याय {ch.id} (Chapter {ch.id})
                            </span>
                          </div>
                          <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-clay-900">
                            {ch.titleHindi}
                          </h3>
                          {englishTranslationVisible && (
                            <p className="font-serif text-sm text-clay-600 tracking-wide mt-1 italic">
                              {ch.titleEnglish}
                            </p>
                          )}
                        </div>

                        {/* Highlights Bullet Panel */}
                        <div className="bg-ivory-50/70 border border-ivory-100/80 rounded-xl p-4 md:p-5 mb-8">
                          <h4 className="font-serif text-xs font-bold text-clay-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b border-ivory-200 pb-1.5">
                            <Award className="w-3.5 h-3.5 text-ochre-600" />
                            <span>मुख्य अंश (Key Learnings)</span>
                          </h4>
                          <ul className="space-y-2 font-hindi text-sm text-clay-700 leading-relaxed md:grid md:grid-cols-1 md:gap-1">
                            {ch.highlights.map((hlt, index) => {
                              const colonIndex = hlt.indexOf(':');
                              const header = colonIndex !== -1 ? hlt.substring(0, colonIndex + 1) : '';
                              const text = colonIndex !== -1 ? hlt.substring(colonIndex + 1) : hlt;
                              return (
                                <li key={index} className="flex items-start gap-2 text-clay-800">
                                  <span className="text-ochre-600 font-bold select-none mt-0.5">•</span>
                                  <span>
                                    {header ? <strong className="text-clay-900 font-bold">{header}</strong> : ''}
                                    {text}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* In-Text Centered Spiritual Quote Accent */}
                        {ch.hasQuote && ch.quote && (
                          <blockquote className="my-8 py-5 px-6 border-l-2 border-ochre-600 bg-ivory-50/50 rounded-r-xl max-w-2xl mx-auto text-center font-hindi">
                            <svg className="w-8 h-8 text-ochre-600/20 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className="text-lg text-clay-900 font-semibold italic italic-h leading-relaxed">
                              “{ch.quote.text}”
                            </p>
                            {englishTranslationVisible && ch.quote.englishText && (
                              <p className="font-serif text-xs text-clay-600 mt-2 tracking-wide font-light">
                                “{ch.quote.englishText}”
                              </p>
                            )}
                          </blockquote>
                        )}

                        {/* Standard Multiline Devanagari Biography Narrative Text */}
                        <div className="font-hindi text-base leading-[1.8] text-clay-800 space-y-6">
                          {ch.content.map((p, pIndex) => (
                            <p key={pIndex} className="text-justify indent-4 break-words">
                              {p}
                            </p>
                          ))}
                        </div>

                        {/* Bottom Navigation Buttons for Easy Chapter Traversal */}
                        <div className="mt-8 pt-6 border-t border-ivory-100 flex items-center justify-between text-xs font-serif text-clay-600">
                          <div>
                            {ch.id > 1 && (
                              <button
                                onClick={() => scrollToChapter(ch.id - 1)}
                                className="px-3 py-1.5 rounded hover:bg-ivory-100 hover:text-clay-900 transition flex items-center gap-1 cursor-pointer"
                              >
                                &larr; पिछला अध्याय {ch.id - 1}
                              </button>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-clay-400">Section {ch.id}/11</span>
                          <div>
                            {ch.id < 11 && (
                              <button
                                onClick={() => scrollToChapter(ch.id + 1)}
                                className="px-3 py-1.5 rounded hover:bg-ivory-100 hover:text-clay-900 transition flex items-center gap-1 cursor-pointer"
                              >
                                अगला अध्याय {ch.id + 1} &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      </div> {/* Closed biography-chapter-node card wrapper */}

                      {/* Vertical Timeline Separator with SVG Line and Marker */}
                      {ch.id < 11 && (
                        <TimelineConnector chapterId={ch.id} englishVisible={englishTranslationVisible} />
                      )}
                    </div>
                  ))}
                  </div>
                </div>

                {/* Interactive Photo Gallery Section */}
                <div className="mt-28 border-t border-ivory-200/80 pt-16">
                  {/* Gallery Section Header */}
                  <div className="flex items-center gap-4 mb-10">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-clay-900 flex items-center gap-2">
                      <span>ऐतिहासिक छायाचित्र दीर्घा (Interactive Photo Gallery)</span>
                    </h2>
                    <div className="flex-1 h-px bg-ivory-200" />
                    <span className="font-sans text-[10px] tracking-widest text-clay-600 uppercase hidden md:inline">Visual Journey of Truth</span>
                  </div>

                  {/* Intro Description */}
                  <p className="font-hindi text-base leading-relaxed text-clay-700 max-w-3xl mb-10 text-justify">
                    पूज्य नागराज जी की साधना स्थली अमरकंटक, उनके हस्तलेखों, और देश-विदेश से आये जिज्ञासुओं के साथ आयोजित संवाद गोष्ठियों की स्मृतियों को संजोए छायाचित्र दीर्घा। यह स्थान सत्य के अन्वेषण और सार्वभौम व्यवस्था को व्यावहारिक रूप देने के अनमोल क्षणों का साक्षी है।
                  </p>

                  {/* Category Selection Tabs & Cloud Link */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap items-center gap-2 bg-ivory-100/50 p-2 rounded-xl border border-ivory-200 max-w-max">
                      <button
                        onClick={() => setGalleryFilter('all')}
                        aria-label="सभी चित्र दिखाएं"
                        className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                          galleryFilter === 'all'
                            ? 'bg-clay-900 text-ivory-50 font-semibold shadow-sm'
                            : 'bg-transparent text-clay-600 hover:text-clay-900 hover:bg-ivory-200/50'
                        }`}
                      >
                        सभी चित्र ({galleryImages.length})
                      </button>
                      <button
                        onClick={() => setGalleryFilter('sadhana')}
                        aria-label="मौन साधना स्थली वर्ग दिखाएं"
                        className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 ${
                          galleryFilter === 'sadhana'
                            ? 'bg-ochre-600 text-white font-semibold shadow-inner transition-all'
                            : 'bg-transparent text-clay-600 hover:text-clay-900 hover:bg-ivory-200/50'
                        }`}
                      >
                        मौन साधना स्थली
                      </button>
                      <button
                        onClick={() => setGalleryFilter('manuscripts')}
                        aria-label="हस्तलेख वर्ग दिखाएं"
                        className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 ${
                          galleryFilter === 'manuscripts'
                            ? 'bg-ochre-600 text-white font-semibold shadow-inner transition-all'
                            : 'bg-transparent text-clay-600 hover:text-clay-900 hover:bg-ivory-200/50'
                        }`}
                      >
                        हस्तलेख व शोधकार्य
                      </button>
                      <button
                        onClick={() => setGalleryFilter('dialogue')}
                        aria-label="संवाद वर्ग दिखाएं"
                        className={`px-4 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 ${
                          galleryFilter === 'dialogue'
                            ? 'bg-ochre-600 text-white font-semibold shadow-inner transition-all'
                            : 'bg-transparent text-clay-600 hover:text-clay-900 hover:bg-ivory-200/50'
                        }`}
                      >
                        संवाद व गोष्ठियाँ
                      </button>
                    </div>

                    <a
                      href="https://u.pcloud.link/publink/show?code=kZ6Gm05ZfUbbDBW8fKmKB9ejvrO6cSRnRRH7#/filemanager?folder=24298539203"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ochre-600/10 hover:bg-ochre-600 text-ochre-800 hover:text-white font-hindi text-xs font-medium border border-ochre-600/20 transition-all shadow-sm max-w-max cursor-pointer group"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-ochre-600 group-hover:text-white" />
                      <span>सभी चित्र क्लाउड में देखें (View All Photos)</span>
                    </a>
                  </div>

                  {/* Image Grid with Motion */}
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredGalleryImages.map((img) => (
                        <motion.div
                          key={img.id}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -6 }}
                          onClick={() => setLightboxIndex(galleryImages.findIndex(orig => orig.id === img.id))}
                          className="bg-ivory-100 border border-ivory-200 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group"
                        >
                          {/* Image Container with Hover zoom */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-clay-100">
                            <img
                              src={img.imageUrl}
                              alt={img.titleHindi}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-clay-950/60 via-clay-950/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="text-white font-mono text-[10px] bg-ochre-600/90 px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                                <Maximize2 className="w-3 h-3" /> विस्तृत देखें (View Detail)
                              </span>
                            </div>
                            <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded bg-clay-900/85 backdrop-blur-md text-ivory-50 border border-ivory-200/10">
                              {img.year}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="p-5">
                            <span className="text-[10px] uppercase font-serif tracking-wider text-ochre-700 font-semibold mb-1 block">
                              {img.category === 'sadhana' ? 'मौन साधना स्थली' : img.category === 'manuscripts' ? 'हस्तलेख व शोध' : 'संवाद व विचार'}
                            </span>
                            <h3 className="font-serif text-base font-bold text-clay-900 line-clamp-1">
                              {img.titleHindi}
                            </h3>
                            {englishTranslationVisible && (
                              <p className="font-serif text-clay-500 text-xs mt-0.5 italic line-clamp-1">
                                {img.titleEnglish}
                              </p>
                            )}
                            <p className="font-hindi text-stone-600 text-xs mt-2.5 leading-relaxed line-clamp-2">
                              {img.descHindi}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Bottom View All CTA */}
                  <div className="mt-12 text-center">
                    <a
                      href="https://u.pcloud.link/publink/show?code=kZ6Gm05ZfUbbDBW8fKmKB9ejvrO6cSRnRRH7#/filemanager?folder=24298539203"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-clay-900 border border-clay-800 hover:bg-clay-800 text-ivory-50 text-xs sm:text-sm font-hindi transition-all shadow-md hover:shadow-lg cursor-pointer group"
                    >
                      <Image className="w-4 h-4 text-ochre-600 group-hover:scale-110 transition-transform" />
                      <span>क्लाउड पर संपूर्ण ऐतिहासिक एल्बम देखें (Browse Entire Photo Album in Cloud)</span>
                      <ExternalLink className="w-4 h-4 text-ochre-400" />
                    </a>
                  </div>
                </div>

                {/* विद्यार्थी संस्मरण (Student Memoirs) Section */}
                <div className="mt-28 border-t border-ivory-200/80 pt-16">
                  {/* Section Title */}
                  <div className="flex items-center gap-4 mb-10">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-clay-900 flex items-center gap-2">
                      <span>श्री नागराज जी के साथ विद्यार्थी संस्मरण (Student Memoirs)</span>
                    </h2>
                    <div className="flex-1 h-px bg-ivory-200" />
                    <span className="font-sans text-[10px] tracking-widest text-clay-600 uppercase hidden md:inline">Saanidhya Memoirs</span>
                  </div>

                  {/* Section Intro */}
                  <p className="font-hindi text-base leading-relaxed text-clay-700 max-w-3xl mb-12 text-justify">
                    श्रद्धेय बाबा जी (श्री ए. नागराज जी) के सानिध्य में अनेक जिज्ञासुओं, शिष्यों व सहयोगियों ने जीवन मूल्यों, मानवता और सह-अस्तित्व की समझ को गहराई से आत्मसात किया। बाबा जी के साथ बिताए उनके संस्मरण, घटनाएँ और जीवन-दृष्टि को यहाँ लिखित लेखों एवं वीडियो साक्षात्कारों के माध्यम से प्रस्तुत किया गया है।
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Written memoirs card */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="bg-ivory-100/80 border border-ivory-200/90 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-ochre-600/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div>
                        {/* Jeevan Vidya Word Cloud Image */}
                        <div className="flex justify-center mb-6">
                          <div className="relative w-40 sm:w-44 aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-ivory-200/60 hover:scale-[1.02] transition-transform duration-300 p-2 flex items-center justify-center">
                            <img
                              src="https://originals.madhyasth.org/i6.png"
                              alt="मध्यस्थ दर्शन जीवनविद्या शब्द-समूह (Jeevan Vidya Word Cloud)"
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        </div>

                        {/* Shloka Board */}
                        <div className="bg-ivory-200/40 border-l-4 border-ochre-600 p-4 rounded-r-xl mb-6">
                          <p className="font-hindi text-sm md:text-base font-bold text-ochre-800 leading-relaxed italic text-center md:text-left">
                            भूमि स्वर्गताम् यातु, मनुष्यो यातु देवताम् ।<br />
                            धर्मों सफलताम् यातु, नित्यम् यातु शुभोदयम् ।।
                          </p>
                          <p className="font-hindi text-xs md:text-sm text-clay-600 mt-2 text-center md:text-left font-medium">
                            (“भूमी स्वर्ग हो, मनुष्य देवता हो, धर्म सफल हो, नित्य शुभ हो”)
                          </p>
                        </div>

                        <h3 className="font-serif text-lg md:text-xl font-bold text-clay-900 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-ochre-600" />
                          <span>‘सानिध्य’ लेख संकलन (Written Studies)</span>
                        </h3>

                        <p className="font-hindi text-stone-600 text-sm leading-relaxed mb-6 text-justify">
                          इस शुभकामना को साकार करने की बाबा जी की जीवन यात्रा में अनेक लोग उनके संपर्क में आये और उनसे जुड़े। ऐसे कुछ साथियों द्वारा, बाबाजी के साथ बिताया समय, उनसे मिली प्रेरणा व मार्गदर्शन के छोटे-बड़े संस्मरणों का एक अमूल्य संकलन इस सानिध्य पुस्तक के रूप में संकलित है।
                        </p>
                      </div>

                      <div>
                        <a
                          href="https://megascale.cloud/JV/folder/About A.Nagraj.zip"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-clay-900 hover:bg-clay-800 text-ivory-50 text-xs sm:text-sm font-hindi font-medium transition-all shadow-md hover:shadow-lg cursor-pointer group"
                        >
                          <Download className="w-4.5 h-4.5 text-ochre-500 group-hover:translate-y-0.5 transition-transform" />
                          <span>‘सानिध्य’ लेख संग्रह डाउनलोड करें (.ZIP)</span>
                          <ExternalLink className="w-3.5 h-3.5 text-clay-400" />
                        </a>
                      </div>
                    </motion.div>

                    {/* Video memoirs card */}
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="bg-ivory-100/80 border border-ivory-200/90 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div>
                        {/* Video thumbnail with Saanidhya Book Cover Image */}
                        <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-ivory-50/50 border border-ivory-200/80 mb-6 relative flex items-center justify-center group-hover:bg-ivory-100/50 transition-colors">
                          <img
                            src="https://originals.madhyasth.org/i5.png"
                            alt="सान्निध्य पुस्तक आवरण (Saanidhya Book Cover)"
                            referrerPolicy="no-referrer"
                            className="h-full object-contain py-1 transition-transform duration-500 group-hover:scale-103"
                          />
                          <div className="absolute inset-0 bg-clay-950/5 group-hover:bg-transparent transition-colors" />
                          <div className="absolute w-15 h-15 rounded-full bg-white/95 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Youtube className="w-7 h-7 text-red-650 pl-0.5 animate-pulse" />
                          </div>
                        </div>

                        <h3 className="font-serif text-lg md:text-xl font-bold text-clay-900 mb-3 flex items-center gap-2">
                          <Youtube className="w-5 h-5 text-red-650" />
                          <span>‘सान्निध्य वार्ता’ विडियो साक्षात्कार (Video Interviews)</span>
                        </h3>

                        <p className="font-hindi text-stone-600 text-sm leading-relaxed mb-6 text-justify">
                          नागराज जी के संपर्क में आये, उनके सानिध्य में समय व्यतीत करने वाले अनेकों प्रबुद्ध साथियों के विचारों, अनुभवों व पवित्र स्मृतियों को वीडियो के रूप में प्रस्तुत किया गया है, जो बाबा जी के जीवन के विभिन्न व्यावहारिक पहलुओं व मानवीय आचरण को सहज रूप से दर्शाता है।
                        </p>
                      </div>

                      <div>
                        <a
                          href="https://www.youtube.com/@SaanidhyaVaarta"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-red-700 hover:bg-red-650 text-white text-xs sm:text-sm font-hindi font-medium transition-all shadow-md hover:shadow-lg cursor-pointer group"
                        >
                          <Youtube className="w-4.5 h-4.5 text-white" />
                          <span>‘सान्निध्य वार्ता’ विडियो साक्षात्कार देखें</span>
                          <ExternalLink className="w-3.5 h-3.5 text-red-200" />
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="literature-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Section 2: Works / Sahitya */}
              <section 
                id="sahitya-section" 
                ref={sahityaRef} 
                className="pt-4"
              >
                {/* Section Divider Header with Icon */}
                <div className="flex items-center gap-4 mb-12">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-clay-900 flex items-center gap-2">
                    <span>साहित्य (Literature)</span>
                  </h2>
                  <div className="flex-1 h-px bg-ivory-200" />
                  <span className="font-sans text-[10px] tracking-widest text-clay-600 uppercase hidden md:inline">The 13 Volumes of Truth</span>
                </div>

                {/* Introductory Whitespace Framed Paragraph */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <p className="font-hindi text-lg leading-relaxed text-clay-800 font-light mb-4 text-justify md:text-center">
                    श्रद्र्धेय श्री ए. नागराज जी ने समाधि और संयम की पराकाष्ठा के उपरांत, जो सार्वभौम ज्ञान अनुभव किया, उसे रहस्यों तथा चमत्कारों से मुक्त कर तार्किक स्वरूप प्रदान किया। यह साहित्य ४ मूल आयामों (दर्शन, वाद, शास्त्र एवं मानवीय संविधान) में विभाजित है जो मानवता के समक्ष जीने का एक अनुपम प्रस्ताव प्रस्तुत करते हैं।
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-ivory-200/50 border border-ivory-100/80 text-[11px] text-clay-600 font-sans tracking-wide">
                    <span>जानकारी और स्रोत: </span>
                    <a 
                      href="https://originals.madhyasth.org/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-ochre-600 hover:text-ochre-700 font-semibold underline inline-flex items-center gap-0.5"
                    >
                      originals.madhyasth.org <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Core Framework & Philosophy Interactive Dashboard */}
                <div className="mb-20 bg-ivory-50 border border-ivory-200/80 rounded-3xl p-5 md:p-8 shadow-sm">
                  <div className="text-center mb-8">
                    <span className="font-serif text-xs font-semibold uppercase tracking-widest text-ochre-600 bg-ochre-600/5 px-2.5 py-1 rounded">
                      मध्यस्थ दर्शन रूपरेखा (Philosophy Overview)
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-clay-950 mt-2.5">
                      दर्शन, विकल्प एवं अनुसन्धान की मूलभूत मान्यताएँ
                    </h3>
                    <p className="font-hindi text-xs md:text-sm text-clay-600 max-w-xl mx-auto mt-1.5 font-light">
                      अस्तित्व मूलक मानव केन्द्रित जीवन-दर्शन के मूलभूत स्तंभों एवं अध्ययन सूत्रों का संक्षिप्त परिचय।
                    </p>
                  </div>

                  {/* Horizontal Tabs List for Desktop / Scrollable for Mobile */}
                  <div className="flex border-b border-ivory-200 overflow-x-auto scroller-hide mb-8 gap-1 p-1 bg-ivory-100 rounded-xl">
                    <button
                      onClick={() => setActiveFrameworkTab('whatIs')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-serif selection:font-bold whitespace-nowrap transition-all flex-1 justify-center cursor-pointer ${
                        activeFrameworkTab === 'whatIs'
                          ? 'bg-clay-900 border border-clay-900 text-ivory-50 shadow-sm font-semibold'
                          : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-200/60'
                      }`}
                    >
                      <span>मध्यस्थ दर्शन क्या है?</span>
                    </button>
                    <button
                      onClick={() => setActiveFrameworkTab('alternative')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-serif selection:font-bold whitespace-nowrap transition-all flex-1 justify-center cursor-pointer ${
                        activeFrameworkTab === 'alternative'
                          ? 'bg-clay-900 border border-clay-900 text-ivory-50 shadow-sm font-semibold'
                          : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-200/60'
                      }`}
                    >
                      <span>नया प्रस्ताव — विकल्प</span>
                    </button>
                    <button
                      onClick={() => setActiveFrameworkTab('threePoints')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-serif selection:font-bold whitespace-nowrap transition-all flex-1 justify-center cursor-pointer ${
                        activeFrameworkTab === 'threePoints'
                          ? 'bg-clay-900 border border-clay-900 text-ivory-50 shadow-sm font-semibold'
                          : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-200/60'
                      }`}
                    >
                      <span>तीन मूल बिंदु</span>
                    </button>
                    <button
                      onClick={() => setActiveFrameworkTab('coexistence')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-serif selection:font-bold whitespace-nowrap transition-all flex-1 justify-center cursor-pointer ${
                        activeFrameworkTab === 'coexistence'
                          ? 'bg-clay-900 border border-clay-900 text-ivory-50 shadow-sm font-semibold'
                          : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-200/60'
                      }`}
                    >
                      <span>सह-अस्तित्व से प्राप्ति</span>
                    </button>
                    <button
                      onClick={() => setActiveFrameworkTab('studyMaterial')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-serif selection:font-bold whitespace-nowrap transition-all flex-1 justify-center cursor-pointer ${
                        activeFrameworkTab === 'studyMaterial'
                          ? 'bg-clay-900 border border-clay-900 text-ivory-50 shadow-sm font-semibold'
                          : 'text-clay-600 hover:text-clay-900 hover:bg-ivory-200/60'
                      }`}
                    >
                      <span>अध्ययन सामग्री</span>
                    </button>
                  </div>

                  {/* Active Tab Panel with high-quality animated entry */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFrameworkTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[250px]"
                    >
                      {activeFrameworkTab === 'whatIs' && (
                        <div className="bg-white/80 border border-ivory-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-ochre-600/10 flex items-center justify-center text-ochre-600 shrink-0">
                              <HelpCircle className="w-6 h-6" />
                            </div>
                            <div className="space-y-4 flex-1">
                              <div>
                                <h4 className="font-serif text-lg font-bold text-clay-950 flex flex-wrap items-center gap-2">
                                  <span>मध्यस्थ दर्शन (सहअस्तित्ववाद) क्या है?</span>
                                  {englishTranslationVisible && (
                                    <span className="font-serif text-xs font-medium text-clay-400 italic">
                                      (What is Madhyasth Darshan?)
                                    </span>
                                  )}
                                </h4>
                                <p className="font-hindi text-xs text-clay-500 mt-0.5">
                                  अस्तित्व मूलक मानव केन्द्रित चिन्तन (Existence-based Human-centric Contemplation)
                                </p>
                              </div>
                              
                              <p className="font-hindi text-sm text-clay-800 leading-relaxed text-justify">
                                मध्यस्थ दर्शन (सहअस्तित्ववाद) भारत वर्ष में निर्गमित एक नया दर्शन है जो श्री अग्रहार नागराज (1920–2016) द्वारा प्रतिपादित एवं लिखित है। यह "अस्तित्व मूलक मानव केन्द्रित जीवन-दर्शन" है जो मनुष्य के सम्पूर्ण आयामों की यथार्थता, वास्तविकता और सत्यता को अध्ययनगम्य और बोधगम्य कराता है।
                              </p>
                              
                              <p className="font-hindi text-sm text-clay-800 leading-relaxed text-justify">
                                यह दर्शन स्वयं प्रयोग, व्यवहार और अनुभवात्मक प्रमाणों की कसौटी से निकला हुआ है — इसीलिए निर्विवाद है। यह 'साधना-समाधि-संयम विधि' से प्राप्त हुआ है। भौतिक, बौद्धिक और आध्यात्मिक में अविभाज्यता की अभिव्यक्ति ही मध्यस्थ दर्शन है।
                              </p>

                              {englishTranslationVisible && (
                                <p className="font-serif text-xs text-stone-500 leading-relaxed bg-ivory-50/50 p-3 rounded-lg italic border-l-2 border-clay-300">
                                  Madhyasth Darshan (Co-existentialism) is a new philosophical proposal emerging from India, propounded by Sri A. Nagraj (1920–2016). It is an "existence-based human-centric vision" that makes the reality and truth of all dimensions of human existence study-friendly and understandable. Received via Sadhana-Samadhi-Samyama, it bridges physical, mental, and spiritual aspects logic-fully.
                                </p>
                              )}

                              <div className="pt-4 border-t border-ivory-100 mt-4 italic text-center max-w-xl mx-auto">
                                <div className="font-hindi text-xs text-clay-700 font-medium leading-relaxed bg-ochre-600/5 rounded-xl px-4 py-3 border border-ochre-600/10">
                                  “साधना समाधी संयमपूर्वक अस्तित्वमूलक मानव केंद्रित चिंतन मुझे समझ में आया। मैं इस आधार पर साधना किया।” <br />
                                  <span className="text-[10px] text-ochre-600 uppercase font-mono tracking-wider font-bold mt-1.5 block">
                                    — श्री ए. नागराज, भजनाश्रम, अमरकंटक
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeFrameworkTab === 'alternative' && (
                        <div className="bg-white/80 border border-ivory-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-ochre-600/10 flex items-center justify-center text-ochre-600 shrink-0">
                              <Layers className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg font-bold text-clay-950 flex items-center gap-2">
                                <span>नया प्रस्ताव — मानवीय विकल्प (A New Alternative)</span>
                              </h4>
                              <p className="font-hindi text-xs text-clay-600 mt-1">
                                मध्यस्थ दर्शन प्रत्येक जीवन क्षेत्र में समस्याओं के स्थान पर एक तर्कसंगत मानवीय विकल्प प्रस्तुत करता है:
                              </p>
                            </div>
                          </div>

                          {/* Alternative comparison grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              { oldH: "द्वंद्वात्मक भौतिकवाद", oldE: "Conflict-based Materialism", newH: "समाधानात्मक भौतिकवाद", newE: "Resolving Materialism" },
                              { oldH: "संघर्षात्मक जनवाद", oldE: "Conflict-based Democracy", newH: "व्यवहारात्मक जनवाद", newE: "Behavioral Democracy" },
                              { oldH: "रहस्यात्मक आध्यात्मवाद", oldE: "Mystical Spiritualism", newH: "अनुभवात्मक आध्यात्मवाद", newE: "Experiential Spiritualism" },
                              { oldH: "लाभोन्मादी अर्थशास्त्र", oldE: "Profit-obsessed Economics", newH: "आवर्तनशील अर्थशास्त्र", newE: "Cyclic/Universal Economics" },
                              { oldH: "भोगोन्मादी समाजशास्त्र", oldE: "Consumption-obsessed Sociology", newH: "व्यवहारवादी समाजशास्त्र", newE: "Behavioral Sociology" },
                              { oldH: "कामोन्मादी मनोविज्ञान", oldE: "Desire-obsessed Psychology", newH: "मानव संचेतनावादी मनोविज्ञान", newE: "Human Consciousness Psychology" }
                            ].map((pair, index) => (
                              <div key={index} className="bg-ivory-100/60 border border-ivory-200/80 rounded-xl p-4 flex flex-col justify-between hover:bg-ivory-200/30 transition-all">
                                <div className="text-stone-400 font-hindi text-xs font-semibold line-through">
                                  {pair.oldH}
                                  {englishTranslationVisible && (
                                    <span className="block font-serif text-[10px] text-stone-400 leading-none italic mt-0.5">
                                      {pair.oldE}
                                    </span>
                                  )}
                                </div>
                                <div className="my-2 text-center text-ochre-600 font-bold font-serif text-sm">
                                  ↓
                                </div>
                                <div className="text-clay-950 font-hindi text-xs font-bold bg-white px-3 py-2 rounded-lg border border-ivory-300 shadow-xs flex flex-col items-center">
                                  <span className="text-clay-900">{pair.newH}</span>
                                  {englishTranslationVisible && (
                                    <span className="font-serif text-[10px] text-ochre-600 italic font-semibold leading-normal mt-0.5">
                                      {pair.newE}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeFrameworkTab === 'threePoints' && (
                        <div className="bg-white/80 border border-ivory-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-ochre-600/10 flex items-center justify-center text-ochre-600 shrink-0">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg font-bold text-clay-950 flex items-center gap-2">
                                <span>अनुसन्धान के आधार — तीन मूल बिंदु (Three Core Points)</span>
                              </h4>
                              <p className="font-hindi text-xs text-clay-600 mt-1">
                                सम्पूर्ण अस्तित्व व जागृतिपूर्ण नियम के मूल अनुसन्धान बिन्दुओं की दार्शनिक रूपरेखा:
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              {
                                id: "1",
                                symbol: "⬡",
                                titleH: "गठनपूर्णता (Gathanpurnata)",
                                descH: "जड़ परमाणु में परिणाम का अमरत्व। जड़ ही विकास पूर्वक चैतन्य पद को प्राप्त करता है — यही 'चैतन्य जीवन परमाणु' है।",
                                descE: "Immortality of Atomic Constitution. Physical matter evolves to attain the state of consciousness - this is the 'Conscious Life Atom'."
                              },
                              {
                                id: "2",
                                symbol: "◈",
                                titleH: "क्रियापूर्णता (Kriyapurnata)",
                                descH: "मानव में ज्ञान पूर्वक श्रम का विश्राम, विकसित चेतना पूर्वक जागृति, समाधान — प्रखर प्रज्ञा, सतर्कता, मानवीयतापूर्ण क्रियाकलाप।",
                                descE: "Completeness of Action. Intellectual resolution and awakening through developed consciousness. Work yields mental relaxation, action yields humane conduct."
                              },
                              {
                                id: "3",
                                symbol: "✦",
                                titleH: "आचरणपूर्णता (Acharanpurnata)",
                                descH: "मानव में अनुभव प्रमाण पूर्वक गति का गंतव्य। जागृतिपूर्णता, सत्य, धर्म, निर्भयता, न्याय, नियम, जीवन तृप्ति और उसकी निरंतरता।",
                                descE: "Completeness of Conduct. Experiential demonstration in living. Truth, righteousness, fearlessness, justice, rule, eternal life-satisfaction."
                              }
                            ].map((point, index) => (
                              <div key={index} className="bg-ivory-100/50 hover:bg-ivory-150 border border-ivory-200 p-5 rounded-2xl relative transition-all flex flex-col justify-between">
                                <div>
                                  <div className="absolute top-4 right-4 text-2xl font-semibold opacity-30 text-ochre-600 font-mono">
                                    {point.symbol}
                                  </div>
                                  <h5 className="font-serif text-sm font-bold text-clay-900 border-b border-ivory-200 pb-2 mb-3">
                                    {point.titleH}
                                  </h5>
                                  <p className="font-hindi text-xs text-stone-700 leading-relaxed text-justify mb-4">
                                    {point.descH}
                                  </p>
                                </div>
                                {englishTranslationVisible && (
                                  <p className="font-serif text-[10.5px] text-stone-500 leading-normal italic border-t border-ivory-200/50 pt-2.5">
                                    {point.descE}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeFrameworkTab === 'coexistence' && (
                        <div className="bg-white/80 border border-ivory-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-ochre-600/10 flex items-center justify-center text-ochre-600 shrink-0">
                              <Heart className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg font-bold text-clay-950 flex items-center gap-2">
                                <span>सह-अस्तित्व से प्राप्ति (Outcomes of Co-existence)</span>
                              </h4>
                              <p className="font-hindi text-xs text-clay-600 mt-1">
                                मध्यस्थ दर्शन में मानव के जीने के सभी आयामों का सार्वभौम समाधान प्रस्तुत है:
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[
                              { label: "व्यक्ति में समाधान", desc: "बौद्धिक स्पष्टता → सुख, शांति, संतोष", english: "In Individual: Resolution/Intellectual clarity -> Happiness, Peace, Contentment" },
                              { label: "संबंधों में तृप्ति", desc: "मूलय निर्वाह → विश्वास, सम्मान, स्नेह", english: "In Relationships: Satisfaction/Value fulfillment -> Trust, Respect, Affection" },
                              { label: "भौतिक समृद्धि", desc: "अभाव का अभाव → उदारता, ममता", english: "Physical Prosperity: Absence of scarcity -> Generosity, Kindness" },
                              { label: "समाज में अभय", desc: "नियम व सार्थकता → अखंड मानव समाज", english: "Fearlessness in Society: Ethical rules -> Undivided Human Society" },
                              { label: "सार्वभौम व्यवस्था", desc: "परिवार से विश्व परिवार → अंतर्राष्ट्र सामरस्यता", english: "Universal Order: From Family to World Family -> International Harmony" },
                              { label: "प्रकृति में सहअस्तित्व", desc: "नैसर्गिक संतुलन → धरती का संतुलन", english: "Coexistence in Nature: Natural balance -> Survival & ecological peace" }
                            ].map((item, index) => (
                              <div key={index} className="bg-ivory-100/50 border border-ivory-200 rounded-xl p-4 flex items-start gap-3 hover:shadow-xs transition-shadow">
                                <div className="w-6 h-6 rounded-full bg-ochre-500/10 flex items-center justify-center text-ochre-600 shrink-0 text-xs mt-0.5">
                                  ✓
                                </div>
                                <div className="space-y-1">
                                  <h5 className="font-serif text-xs font-bold text-clay-950">
                                    {item.label}
                                  </h5>
                                  <p className="font-hindi text-xs leading-normal font-semibold text-ochre-700">
                                    {item.desc}
                                  </p>
                                  {englishTranslationVisible && (
                                    <p className="font-serif text-[10px] text-stone-500 italic leading-snug">
                                      {item.english}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeFrameworkTab === 'studyMaterial' && (
                        <div className="bg-white/80 border border-ivory-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
                          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-ochre-600/10 flex items-center justify-center text-ochre-600 shrink-0">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg font-bold text-clay-950 flex items-center gap-2">
                                <span>अध्ययन सामग्री (Study & Learning Materials)</span>
                              </h4>
                              <p className="font-hindi text-xs text-clay-600 mt-1">
                                प्रामाणिक ज्ञान को समझने तथा अध्ययन हेतु उपलब्ध निःशुल्क संसाधनों की सूची:
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              {
                                icon: "📖",
                                titleH: "प्रकाशित ग्रंथ",
                                descH: "नागराज जी के सम्पूर्ण प्रकाशित वाङ्मय का PDF संग्रह।",
                                btnH: "PDF डाउनलोड करें →",
                                link: "https://originals.madhyasth.org/"
                              },
                              {
                                icon: "📱",
                                titleH: "ऐप में पढ़ें",
                                descH: "जीवन विद्या शिविर सूचना, पुस्तक एवं परिभाषाओं के लिए ऐप।",
                                btnH: "ऐप डाउनलोड करें →",
                                link: "https://originals.madhyasth.org/"
                              },
                              {
                                icon: "🎬",
                                titleH: "विडियो वार्ता",
                                descH: "नागराज जी के साथ हुए संवाद एवं वार्ता के विडियो।",
                                btnH: "YouTube पर देखें →",
                                link: "https://www.youtube.com/@JeevanVidya"
                              },
                              {
                                icon: "🌿",
                                titleH: "परिचयात्मक चयन",
                                descH: "नवीन आगंतुकों के लिए प्रारंभिक पठन हेतु संकलित सामग्री।",
                                btnH: "पठन सामग्री देखें →",
                                link: "https://originals.madhyasth.org/"
                              },
                              {
                                icon: "💬",
                                titleH: "संवाद संग्रह",
                                descH: "नागराज जी के साथ हुए प्रश्नोत्तरी एवं वार्ताओं का संकलन।",
                                btnH: "संवाद डाउनलोड करें →",
                                link: "https://originals.madhyasth.org/"
                              },
                              {
                                icon: "✍️",
                                titleH: "लेखक सन्देश",
                                descH: "श्री नागराज जी का अपने अनुभव एवं साधना पर स्वयं का वक्तव्य।",
                                btnH: "सन्देश पढ़ें →",
                                link: "https://originals.madhyasth.org/shri-nagraj-ji"
                              }
                            ].map((mat, index) => (
                              <a
                                key={index}
                                href={mat.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group bg-ivory-100/60 hover:bg-ivory-200/50 hover:border-ochre-500/40 border border-ivory-200 rounded-xl p-4 transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{mat.icon}</span>
                                    <h5 className="font-serif text-sm font-bold text-clay-950 group-hover:text-ochre-600 transition-colors">
                                      {mat.titleH}
                                    </h5>
                                  </div>
                                  <p className="font-hindi text-xs text-stone-600 leading-relaxed mb-3">
                                    {mat.descH}
                                  </p>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-ochre-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                                  {mat.btnH}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Interactive Filtering and Catalog Search Panel */}
                <div className="mb-10 bg-ivory-100 border border-ivory-200 rounded-2xl p-4 md:p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    
                    {/* Category Pill Filters */}
                    <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                          selectedCategory === 'all'
                            ? 'bg-clay-900 text-ivory-50 border border-clay-900 shadow-sm'
                            : 'bg-ivory-100 hover:bg-ivory-200 border border-ivory-200 text-clay-700'
                        }`}
                      >
                        सभी ग्रंथ ({booksList.length})
                      </button>
                      <button
                        onClick={() => setSelectedCategory('darshan')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 border ${
                          selectedCategory === 'darshan'
                            ? 'bg-amber-900 border-amber-900 text-amber-50 shadow-sm font-semibold'
                            : 'bg-amber-50/50 border-amber-100 hover:bg-amber-50 text-amber-800'
                        }`}
                      >
                        ४ दर्शन (Philosophical)
                      </button>
                      <button
                        onClick={() => setSelectedCategory('vada')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 border ${
                          selectedCategory === 'vada'
                            ? 'bg-emerald-950 border-emerald-950 text-emerald-50 shadow-sm font-semibold'
                            : 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        ३ वाद (Ideological)
                      </button>
                      <button
                        onClick={() => setSelectedCategory('shastra')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 border ${
                          selectedCategory === 'shastra'
                            ? 'bg-rose-900 border-rose-900 text-rose-50 shadow-sm font-semibold'
                            : 'bg-rose-50/50 border-rose-100 hover:bg-rose-50 text-rose-800'
                        }`}
                      >
                        ३ शास्त्र (Scientific)
                      </button>
                      <button
                        onClick={() => setSelectedCategory('samvidhan')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center gap-1 border ${
                          selectedCategory === 'samvidhan'
                            ? 'bg-orange-850 border-orange-850 text-orange-50 shadow-sm font-semibold'
                            : 'bg-orange-50/50 border-orange-100 hover:bg-orange-50 text-orange-800'
                        }`}
                      >
                        संविधान व शब्दावली (Reference)
                      </button>
                    </div>

                    {/* Dynamic Interactive Input Search Bar */}
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        placeholder="खोजें (Search literature)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-4 py-2 bg-ivory-50 border border-ivory-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-ochre-600 focus:border-ochre-600 text-clay-800"
                      />
                      <Search className="w-4 h-4 text-clay-400 absolute left-2.5 top-2.5" />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 px-1 text-[10px] text-clay-400 hover:text-clay-800"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                  </div>
                </div>

                {/* Book Catalog Cards Elegant Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredBooks.map((book) => {
                      const categoryTheme = getCategoryTheme(book.category);
                      return (
                        <motion.div
                          key={book.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                          className="bg-ivory-100 border border-ivory-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            {/* Book Cover / Category Badge */}
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-ivory-100">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${categoryTheme?.bg}`}>
                                {categoryTheme?.label}
                              </span>
                              {book.pages && (
                                <span className="font-mono text-[10px] text-clay-400">
                                  {book.pages} पृष्ठ (Pages)
                                </span>
                              )}
                            </div>

                            {/* Book Title */}
                            <div className="mb-3">
                              <h4 className="font-serif text-lg font-bold text-clay-900 flex items-center gap-1.5 leading-snug">
                                <Book className="w-4.5 h-4.5 text-ochre-600 shrink-0" />
                                <span>{book.titleHindi}</span>
                              </h4>
                              <p className="font-serif text-xs text-clay-500 font-semibold tracking-wide italic leading-normal">
                                {book.titleEnglish}
                              </p>
                              {englishTranslationVisible && (
                                <p className="font-sans text-[10.5px] text-clay-400 font-medium tracking-normal mt-0.5">
                                  ({book.translationEnglish})
                                </p>
                              )}
                            </div>

                            {/* Brief Book Description (Hindi) */}
                            <p className="font-hindi text-stone-700 text-xs leading-[1.65] text-justify mt-3.5 mb-1 bg-ivory-100/30 p-2.5 rounded-lg border border-ivory-100">
                              {book.descriptionHindi}
                            </p>

                            {/* Brief Book Description (English) */}
                            {englishTranslationVisible && (
                              <p className="font-serif text-stone-500 text-[11px] leading-[1.5] text-justify mt-2 mb-2 italic">
                                {book.descriptionEnglish}
                              </p>
                            )}
                          </div>

                          {/* Book Metadata and Read / Study Call to actions */}
                          <div className="mt-4 pt-3 border-t border-ivory-100 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-clay-400 font-mono">Book Vol. {book.id}</span>
                            <a 
                              href="https://originals.madhyasth.org/" 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-ochre-600 hover:text-ochre-700 font-serif font-bold transition flex items-center gap-0.5 group"
                            >
                              अनुसंधान सूची <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* No results placeholder */}
                {filteredBooks.length === 0 && (
                  <div className="text-center py-16 bg-ivory-100 border border-dashed border-ivory-200 rounded-2xl max-w-lg mx-auto">
                    <HelpCircle className="w-12 h-12 text-clay-300 mx-auto mb-4 animate-bounce" />
                    <p className="font-hindi text-base text-clay-600 font-semibold selection:font-bold">कोई ग्रंथ नहीं मिला</p>
                    <p className="font-serif text-xs text-clay-400 mt-1">No works found matching your search term.</p>
                    <button 
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-1.5 rounded bg-ivory-100 hover:bg-ivory-200 text-clay-600 font-serif text-xs cursor-pointer border border-ivory-200"
                    >
                      वापस सभी दिखाएं (Reset Filters)
                    </button>
                  </div>
                )}

                {/* Core philosophy quote summary panel */}
                <div className="mt-16 bg-ivory-100/60 border border-ivory-200 rounded-3xl p-6 md:p-12 relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 opacity-[0.03] text-clay-900">
                    <Sparkles className="w-48 h-48" />
                  </div>
                  
                  <div className="max-w-2xl mx-auto text-center relative z-10">
                    <div className="w-8 h-8 rounded-full bg-ochre-600/10 flex items-center justify-center text-ochre-600 mx-auto mb-4">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <p className="font-hindi text-base md:text-lg font-medium text-clay-900 leading-relaxed max-w-xl mx-auto italic">
                      “न्यायपूर्ण व्यवहार ही मानव जीवन का आचरण है, और विकासक्रम में सह-अस्तित्व ही प्रकृति का अंतिम नियम है।”
                    </p>
                    <p className="font-serif text-xs text-clay-500 tracking-wider mt-3 uppercase italic">
                      — Shri A. Nagraj, Amarkantak
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Elegant Serene Footer */}
      <footer className="bg-clay-900 text-ivory-100 pt-16 pb-10 border-t border-clay-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-clay-800 pb-12 mb-10">
            
            {/* Left Branding */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ochre-600 flex items-center justify-center text-ivory-50 text-base font-bold">
                  ॐ
                </div>
                <h3 className="font-serif text-lg font-bold text-ivory-50">Shri A. Nagraj</h3>
              </div>
              <p className="font-hindi text-stone-300 text-sm leading-relaxed max-w-sm">
                अमरकंटक में नर्मदा के पावन तट पर दशकों की दीर्घ तपस्या, ध्यान और संयम के उपरांत प्राप्त सार्वभौम ज्ञान। मध्यस्थ दर्शन सम्पूर्ण ब्रह्मांड के सह-अस्तित्व का प्रामाणिक प्रस्ताव है।
              </p>
              <p className="font-sans text-xs text-stone-400">
                Livelihood through self-labor & life with resolution.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-ochre-600">विषय-सूची (Table of Contents)</h4>
              <ul className="space-y-2 text-sm text-stone-300 font-serif">
                <li>
                  <button 
                    onClick={() => navigateToPage('jeevani')}
                    className="hover:text-ochre-600 transition flex items-center gap-1 cursor-pointer font-serif"
                  >
                    <span>विस्तृत जीवनी (Jeevani)</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToPage('sahitya')}
                    className="hover:text-ochre-600 transition flex items-center gap-1 cursor-pointer font-serif"
                  >
                    <span>साहित्य सूची (Literature)</span>
                  </button>
                </li>
                <li>
                  <a 
                    href="https://originals.madhyasth.org/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-ochre-600 transition inline-flex items-center gap-1"
                  >
                    <span>मूल स्रोत पुस्तक पुस्तकालय</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Quote of Madhyasth Darshan */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-ochre-600">शाश्वत संदेश (Eternal Message)</h4>
              <div className="bg-clay-800/50 rounded-xl p-4 border border-clay-800">
                <p className="font-hindi text-sm text-stone-200 leading-relaxed italic">
                  “समाधान ही सुख है, समृद्धि ही शांति है, अभय ही आनंद है और सह-अस्तित्व ही सर्वोच्च सत्य है।”
                </p>
                <p className="text-[10px] text-stone-400 tracking-widest uppercase mt-2 font-serif">— Jeevan Vidya</p>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 text-center md:text-left gap-4">
            <div>
              <p>© {new Date().getFullYear()} Madhyasth Darshan. All Rights Dedicated to Humanity.</p>
              <p className="font-hindi text-[11px] mt-1 text-stone-500">
                संविधान एवं साहित्य संकलन: originals.madhyasth.org से साभार।
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-hindi font-light px-2.5 py-1 rounded bg-stone-800 border border-stone-800 flex items-center gap-1 text-[11px] text-stone-300">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>सह-अस्तित्व ही जीवन है</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Desktop Floating Action for Scrolling to Top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-clay-900 hover:bg-clay-800 text-ivory-50 shadow-lg border border-clay-800 transition-all cursor-pointer z-40"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5 text-ochre-600" />
        </motion.button>
      )}

      {/* Lightbox Modal for Photo Gallery */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-clay-950/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-8 select-none"
            role="dialog"
            aria-modal="true"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between text-ivory-100 max-w-7xl mx-auto w-full pt-2">
              <span className="font-mono text-xs text-stone-400">
                छायाचित्र {lightboxIndex + 1} / {galleryImages.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer text-ivory-100"
                aria-label="क्लोज (Close)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Middle slider content */}
            <div className="relative flex-1 flex items-center justify-center max-w-7xl mx-auto w-full my-4">
              {/* Left Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1));
                }}
                className="p-3 rounded-full hover:bg-white/10 text-ivory-100 transition absolute left-2 md:left-4 z-10 cursor-pointer"
                aria-label="पिछला चित्र (Previous)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>

              {/* Selected Fullscreen Image */}
              <motion.div 
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-h-[55vh] md:max-h-[65vh] max-w-[90vw] md:max-w-[75vw] flex items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={galleryImages[lightboxIndex].imageUrl}
                  alt={galleryImages[lightboxIndex].titleHindi}
                  referrerPolicy="no-referrer"
                  className="max-h-[55vh] md:max-h-[65vh] object-contain rounded-xl shadow-2xl border border-stone-800"
                />
              </motion.div>

              {/* Right Arrow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1));
                }}
                className="p-3 rounded-full hover:bg-white/10 text-ivory-100 transition absolute right-2 md:right-4 z-10 cursor-pointer"
                aria-label="अगला चित्र (Next)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Bottom Caption bar */}
            <div 
              className="max-w-4xl mx-auto w-full bg-stone-900/80 backdrop-blur-lg border border-stone-800/80 rounded-2xl p-6 md:p-8 text-ivory-100 mb-2 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="font-mono text-[10px] bg-ochre-700 text-white font-bold px-2 py-0.5 rounded">
                  {galleryImages[lightboxIndex].year}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 font-serif">
                  {galleryImages[lightboxIndex].category === 'sadhana' ? 'मौन साधना' : galleryImages[lightboxIndex].category === 'manuscripts' ? 'हस्तलेख व साहित्य' : 'संवाद व विचार'}
                </span>
              </div>
              <h3 className="font-serif text-lg md:text-xl font-bold text-ivory-50 mb-1">
                {galleryImages[lightboxIndex].titleHindi}
              </h3>
              {englishTranslationVisible && (
                <p className="font-serif text-stone-400 text-xs mt-0.5 italic mb-3">
                  {galleryImages[lightboxIndex].titleEnglish}
                </p>
              )}
              <p className="font-hindi text-stone-300 text-sm leading-relaxed max-w-2xl mx-auto">
                {galleryImages[lightboxIndex].descHindi}
              </p>
              {englishTranslationVisible && (
                <p className="font-serif text-stone-400 text-xs leading-normal max-w-2xl mx-auto mt-2 italic font-light">
                  {galleryImages[lightboxIndex].descEnglish}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
