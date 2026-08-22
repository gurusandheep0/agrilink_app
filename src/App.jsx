import { useEffect, useMemo, useState } from "react";
import {
  Accessibility,
  ArrowLeft,
  BadgeCheck,
  Bell,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudSun,
  CreditCard,
  Droplets,
  Eye,
  FlaskConical,
  Headphones,
  Heart,
  Home,
  IndianRupee,
  Languages,
  LayoutGrid,
  LifeBuoy,
  LocateFixed,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Minus,
  Navigation2,
  Phone,
  Plus,
  ReceiptText,
  Route,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Star,
  Tractor,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
  Wind,
  Wrench,
  X,
} from "lucide-react";
import {
  categories,
  demoBookings,
  notifications as initialNotifications,
  onboardingSlides,
  services,
} from "./data";

const iconMap = {
  grid: LayoutGrid,
  tractor: Tractor,
  users: UsersRound,
  droplets: Droplets,
  sprout: Sprout,
  wind: Wind,
  flask: FlaskConical,
  truck: Truck,
  route: Route,
  check: CheckCircle2,
  weather: CloudSun,
};

const money = new Intl.NumberFormat("en-IN");

function App() {
  const [screen, setScreen] = useState("onboarding");
  const [screenStack, setScreenStack] = useState([]);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favourites, setFavourites] = useState(new Set(["irrigation-repair"]));
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("8:00 AM");
  const [quantity, setQuantity] = useState(2);
  const [selectedAddress, setSelectedAddress] = useState("north");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentAccepted, setPaymentAccepted] = useState(true);
  const [paying, setPaying] = useState(false);
  const [bookings, setBookings] = useState(demoBookings);
  const [latestBooking, setLatestBooking] = useState(null);
  const [bookingTab, setBookingTab] = useState("Upcoming");
  const [notificationItems, setNotificationItems] = useState(initialNotifications);
  const [language, setLanguage] = useState("English");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [toast, setToast] = useState("");

  const go = (next) => {
    setScreenStack((current) => [...current, screen]);
    setScreen(next);
  };

  const goRoot = (next) => {
    setScreenStack([]);
    setScreen(next);
  };

  const goBack = () => {
    if (!screenStack.length) {
      setScreen("home");
      return;
    }
    const next = [...screenStack];
    const previous = next.pop();
    setScreenStack(next);
    setScreen(previous);
  };

  useEffect(() => {
    document.querySelector(".phone-app")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message) => setToast(message);

  const openService = (service) => {
    setSelectedService(service);
    go("service");
  };

  const toggleFavourite = (serviceId) => {
    setFavourites((current) => {
      const next = new Set(current);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
    showToast(favourites.has(serviceId) ? "Removed from saved services" : "Service saved");
  };

  const pricing = useMemo(() => {
    const serviceAmount = selectedService.price * quantity;
    const serviceFee = 49;
    const protection = 40;
    return { serviceAmount, serviceFee, protection, total: serviceAmount + serviceFee + protection };
  }, [selectedService, quantity]);

  const confirmPayment = () => {
    if (!paymentAccepted || paying) return;
    setPaying(true);
    window.setTimeout(() => {
      const created = {
        id: `AGR-${2050 + bookings.length}`,
        serviceId: selectedService.id,
        status: "Confirmed",
        date: selectedDate === 0 ? "Tomorrow" : "Saturday, 24 Aug",
        time: selectedSlot,
        location: selectedAddress === "north" ? "North field, Thiruvallur" : "Main farm, Thiruvallur",
        provider: selectedService.provider,
        amount: pricing.total,
        progress: 1,
      };
      setBookings((current) => [created, ...current]);
      setLatestBooking(created);
      setPaying(false);
      go("confirmation");
    }, 900);
  };

  const markNotificationsRead = () => {
    setNotificationItems((current) => current.map((item) => ({ ...item, unread: false })));
    showToast("All notifications marked as read");
  };

  const screenProps = {
    go,
    goRoot,
    goBack,
    showToast,
  };

  const renderScreen = () => {
    switch (screen) {
      case "onboarding":
        return (
          <OnboardingScreen
            index={onboardingIndex}
            setIndex={setOnboardingIndex}
            onComplete={() => goRoot("home")}
          />
        );
      case "home":
        return (
          <HomeScreen
            {...screenProps}
            language={language}
            services={services}
            favourites={favourites}
            toggleFavourite={toggleFavourite}
            openService={openService}
            setSelectedCategory={setSelectedCategory}
            unreadCount={notificationItems.filter((item) => item.unread).length}
          />
        );
      case "explore":
        return (
          <ExploreScreen
            {...screenProps}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            favourites={favourites}
            toggleFavourite={toggleFavourite}
            openService={openService}
          />
        );
      case "service":
        return (
          <ServiceDetailScreen
            {...screenProps}
            service={selectedService}
            isFavourite={favourites.has(selectedService.id)}
            toggleFavourite={toggleFavourite}
          />
        );
      case "schedule":
        return (
          <ScheduleScreen
            {...screenProps}
            service={selectedService}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        );
      case "location":
        return (
          <LocationScreen
            {...screenProps}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        );
      case "payment":
        return (
          <PaymentScreen
            {...screenProps}
            service={selectedService}
            quantity={quantity}
            pricing={pricing}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentAccepted={paymentAccepted}
            setPaymentAccepted={setPaymentAccepted}
            paying={paying}
            confirmPayment={confirmPayment}
          />
        );
      case "confirmation":
        return (
          <ConfirmationScreen
            {...screenProps}
            booking={latestBooking}
            service={selectedService}
          />
        );
      case "bookings":
        return (
          <BookingsScreen
            {...screenProps}
            bookings={bookings}
            bookingTab={bookingTab}
            setBookingTab={setBookingTab}
            setLatestBooking={setLatestBooking}
            setSelectedService={setSelectedService}
          />
        );
      case "tracking":
        return (
          <TrackingScreen
            {...screenProps}
            booking={latestBooking || bookings[0]}
            service={
              services.find((item) => item.id === (latestBooking || bookings[0]).serviceId) || selectedService
            }
          />
        );
      case "notifications":
        return (
          <NotificationsScreen
            {...screenProps}
            notifications={notificationItems}
            markAllRead={markNotificationsRead}
          />
        );
      case "profile":
        return (
          <ProfileScreen
            {...screenProps}
            language={language}
            setLanguage={setLanguage}
            largeText={largeText}
            setLargeText={setLargeText}
            highContrast={highContrast}
            setHighContrast={setHighContrast}
          />
        );
      case "support":
        return <SupportScreen {...screenProps} />;
      default:
        return null;
    }
  };

  const showNav = ["home", "explore", "bookings", "profile"].includes(screen);

  return (
    <div className={`app-stage ${largeText ? "large-text" : ""} ${highContrast ? "high-contrast" : ""}`}>
      <DesktopStory onStart={() => goRoot("home")} />
      <main className={`phone-app ${screen === "onboarding" ? "phone-app--onboarding" : ""}`}>
        {renderScreen()}
        {showNav && <BottomNav active={screen} onNavigate={goRoot} />}
        {toast && (
          <div className="toast" role="status">
            <CheckCircle2 size={18} aria-hidden="true" />
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

function Brand({ light = false }) {
  return (
    <div className={`brand ${light ? "brand--light" : ""}`} aria-label="AgriLink">
      <span className="brand__mark">
        <Sprout size={21} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span>AgriLink</span>
    </div>
  );
}

function DesktopStory({ onStart }) {
  return (
    <aside className="desktop-story">
      <div className="desktop-story__wash" />
      <div className="desktop-story__content">
        <Brand light />
        <div className="desktop-story__copy">
          <span className="eyebrow eyebrow--light">Farm services, without the uncertainty</span>
          <h1>More time farming. Less time finding help.</h1>
          <p>
            Discover trusted equipment and agricultural specialists nearby, book at a clear price, and
            follow the job from arrival to completion.
          </p>
          <div className="story-points">
            <span><BadgeCheck size={20} /> Verified providers</span>
            <span><ReceiptText size={20} /> Transparent pricing</span>
            <span><Route size={20} /> Live job updates</span>
          </div>
          <button className="button button--cream button--fit" type="button" onClick={onStart}>
            Explore the prototype <ChevronRight size={19} />
          </button>
        </div>
        <p className="desktop-story__note">Interactive product prototype · Designed for clear, confident task completion</p>
      </div>
    </aside>
  );
}

function OnboardingScreen({ index, setIndex, onComplete }) {
  const slide = onboardingSlides[index];
  const isLast = index === onboardingSlides.length - 1;

  return (
    <section className="onboarding screen-scroll">
      <div className="onboarding__image">
        <img src="/agrilink-farmer-hero-v2.png" alt="Farmer using AgriLink beside a tractor" />
        <div className="onboarding__image-overlay" />
        <div className="onboarding__topbar">
          <Brand light />
          <button className="text-button text-button--light" type="button" onClick={onComplete}>
            Skip
          </button>
        </div>
        <div className="trust-chip"><ShieldCheck size={17} /> Built for trusted local service</div>
      </div>
      <div className="onboarding__body">
        <span className="eyebrow">{slide.eyebrow}</span>
        <h1>{slide.title}</h1>
        <p>{slide.copy}</p>
        <div className="slide-dots" aria-label={`Slide ${index + 1} of ${onboardingSlides.length}`}>
          {onboardingSlides.map((item, slideIndex) => (
            <button
              key={item.eyebrow}
              className={slideIndex === index ? "active" : ""}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
        <button
          className="button button--primary button--wide"
          type="button"
          onClick={() => (isLast ? onComplete() : setIndex(index + 1))}
        >
          {isLast ? "Find services near me" : "Continue"}
          <ChevronRight size={20} />
        </button>
        <p className="onboarding__assist"><Accessibility size={16} /> Larger text and contrast options in Profile</p>
      </div>
    </section>
  );
}

function HomeScreen({
  go,
  goRoot,
  language,
  favourites,
  toggleFavourite,
  openService,
  setSelectedCategory,
  unreadCount,
}) {
  return (
    <section className="page screen-scroll page--with-nav">
      <header className="home-header">
        <div>
          <span className="home-header__hello">Good morning, Arjun</span>
          <button className="location-button" type="button" onClick={() => go("location")}>
            <MapPin size={17} /> North field, Thiruvallur <ChevronDown size={15} />
          </button>
        </div>
        <div className="header-actions">
          <button className="icon-button icon-button--soft" type="button" aria-label={`Language: ${language}`} onClick={() => goRoot("profile")}>
            <Languages size={20} />
          </button>
          <button className="icon-button icon-button--soft notification-button" type="button" aria-label="Open notifications" onClick={() => go("notifications")}>
            <Bell size={20} />
            {unreadCount > 0 && <span>{unreadCount}</span>}
          </button>
        </div>
      </header>

      <button className="search-box" type="button" onClick={() => goRoot("explore")}>
        <Search size={20} />
        <span>What does your farm need?</span>
        <SlidersHorizontal size={19} />
      </button>

      <div className="weather-strip">
        <div className="weather-strip__icon"><CloudSun size={25} /></div>
        <div><strong>29°C · Good for field work</strong><span>No rain expected until 6 PM</span></div>
        <ChevronRight size={18} />
      </div>

      <section className="content-section">
        <SectionHeading title="Services" action="See all" onAction={() => goRoot("explore")} />
        <div className="category-row hide-scrollbar">
          {categories.slice(1).map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <button
                className="category-tile"
                type="button"
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  goRoot("explore");
                }}
              >
                <span><Icon size={23} /></span>
                {category.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="hero-card">
        <img src="/agrilink-farmer-hero-v2.png" alt="Farmer standing by a tractor in a green field" />
        <div className="hero-card__overlay" />
        <div className="hero-card__content">
          <span className="hero-card__tag"><BadgeCheck size={15} /> Trusted near you</span>
          <h2>Prepare your field on time.</h2>
          <p>Verified tractors available from ₹1,200/acre.</p>
          <button className="button button--cream button--small" type="button" onClick={() => openService(services[0])}>
            View tractors <ChevronRight size={17} />
          </button>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading title="Popular near you" action="View map" onAction={() => goRoot("explore")} />
        <div className="service-list">
          {services.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isFavourite={favourites.has(service.id)}
              onFavourite={() => toggleFavourite(service.id)}
              onOpen={() => openService(service)}
            />
          ))}
        </div>
      </section>

      <button className="support-banner" type="button" onClick={() => go("support")}>
        <span className="support-banner__icon"><Headphones size={22} /></span>
        <span><strong>Need help booking?</strong><small>Speak to our farmer support team</small></span>
        <ChevronRight size={19} />
      </button>
    </section>
  );
}

function ExploreScreen({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  favourites,
  toggleFavourite,
  openService,
}) {
  const filtered = services.filter((service) => {
    const inCategory = selectedCategory === "all" || service.category === selectedCategory;
    const searchable = `${service.name} ${service.provider}`.toLowerCase();
    return inCategory && searchable.includes(searchQuery.toLowerCase());
  });

  return (
    <section className="page screen-scroll page--with-nav">
      <div className="page-heading">
        <span className="eyebrow">Near Thiruvallur</span>
        <h1>Find farm services</h1>
        <p>Compare trusted providers and clear prices.</p>
      </div>
      <label className="search-box search-box--input">
        <Search size={20} />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search equipment or services"
          aria-label="Search equipment or services"
        />
        {searchQuery ? (
          <button type="button" aria-label="Clear search" onClick={() => setSearchQuery("")}><X size={18} /></button>
        ) : (
          <SlidersHorizontal size={19} />
        )}
      </label>
      <div className="filter-row hide-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`filter-chip ${selectedCategory === category.id ? "active" : ""}`}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="result-heading">
        <strong>{filtered.length} services found</strong>
        <button type="button">Recommended <ChevronDown size={15} /></button>
      </div>
      <div className="service-list service-list--explore">
        {filtered.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isFavourite={favourites.has(service.id)}
            onFavourite={() => toggleFavourite(service.id)}
            onOpen={() => openService(service)}
          />
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <Search size={30} />
          <h2>No services found</h2>
          <p>Try a broader search or choose another category.</p>
          <button className="button button--outline" type="button" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

function ServiceCard({ service, isFavourite, onFavourite, onOpen }) {
  const Icon = iconMap[service.icon] || Wrench;
  return (
    <article className="service-card">
      <button className={`service-art service-art--${service.tone}`} type="button" onClick={onOpen} aria-label={`Open ${service.name}`}>
        <Icon size={36} strokeWidth={1.8} />
        <span>{service.duration}</span>
      </button>
      <div className="service-card__body">
        <div className="service-card__topline">
          <span className="verified-label"><BadgeCheck size={14} /> Verified</span>
          <button className={`heart-button ${isFavourite ? "active" : ""}`} type="button" aria-label={isFavourite ? "Remove from saved" : "Save service"} onClick={onFavourite}>
            <Heart size={18} fill={isFavourite ? "currentColor" : "none"} />
          </button>
        </div>
        <button className="service-card__link" type="button" onClick={onOpen}>
          <strong>{service.name}</strong>
          <span>{service.provider}</span>
        </button>
        <div className="service-meta">
          <span><Star size={15} fill="currentColor" /> {service.rating} ({service.reviews})</span>
          <span><MapPin size={14} /> {service.distance}</span>
        </div>
        <div className="service-card__price">
          <span><strong>₹{money.format(service.price)}</strong> / {service.unit}</span>
          <button type="button" onClick={onOpen} aria-label={`Book ${service.name}`}><ChevronRight size={18} /></button>
        </div>
      </div>
    </article>
  );
}

function ServiceDetailScreen({ go, goBack, service, isFavourite, toggleFavourite }) {
  const Icon = iconMap[service.icon] || Wrench;
  return (
    <section className="page screen-scroll page--sticky-action">
      <div className="detail-hero">
        {service.id === "tractor-tilling" ? (
          <img src="/agrilink-farmer-hero-v2.png" alt="Tractor service in a cultivated field" />
        ) : (
          <div className={`detail-hero__art service-art--${service.tone}`}><Icon size={92} strokeWidth={1.25} /></div>
        )}
        <div className="detail-hero__shade" />
        <button className="icon-button icon-button--glass detail-hero__back" type="button" aria-label="Go back" onClick={goBack}>
          <ArrowLeft size={21} />
        </button>
        <button className={`icon-button icon-button--glass detail-hero__save ${isFavourite ? "active" : ""}`} type="button" aria-label="Save service" onClick={() => toggleFavourite(service.id)}>
          <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
        </button>
        <span className="detail-hero__verified"><BadgeCheck size={16} /> Verified provider</span>
      </div>
      <div className="detail-content">
        <div className="detail-title-row">
          <div><span className="eyebrow">{service.category}</span><h1>{service.name}</h1></div>
          <div className="rating-badge"><Star size={15} fill="currentColor" /> {service.rating}</div>
        </div>
        <button className="provider-row" type="button">
          <span className="provider-avatar">{service.provider.charAt(0)}</span>
          <span><strong>{service.provider}</strong><small>{service.reviews} farmer reviews · {service.distance} away</small></span>
          <ChevronRight size={18} />
        </button>
        <div className="quick-facts">
          <span><Clock3 size={20} /><strong>{service.duration}</strong><small>Typical time</small></span>
          <span><ShieldCheck size={20} /><strong>Protected</strong><small>Booking support</small></span>
          <span><IndianRupee size={20} /><strong>No surprise fee</strong><small>Price shown first</small></span>
        </div>
        <section className="detail-section">
          <h2>About this service</h2>
          <p>{service.description}</p>
        </section>
        <section className="detail-section">
          <h2>What is included</h2>
          <ul className="included-list">
            {service.includes.map((item) => <li key={item}><Check size={17} /> {item}</li>)}
          </ul>
        </section>
        <section className="detail-section review-preview">
          <div><h2>Farmer reviews</h2><span><Star size={16} fill="currentColor" /> {service.rating} from {service.reviews} reviews</span></div>
          <blockquote>“The provider called before arriving and finished the field on time. The price matched the booking.”</blockquote>
          <small>— Selvam, verified booking</small>
        </section>
      </div>
      <div className="sticky-action">
        <div><small>Starting at</small><strong>₹{money.format(service.price)} <span>/ {service.unit}</span></strong></div>
        <button className="button button--primary" type="button" onClick={() => go("schedule")}>Book service <ChevronRight size={19} /></button>
      </div>
    </section>
  );
}

function ScheduleScreen({ go, goBack, service, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot, quantity, setQuantity }) {
  const dates = [
    { day: "Fri", date: "23", note: "Tomorrow" },
    { day: "Sat", date: "24", note: "Best" },
    { day: "Sun", date: "25", note: "" },
    { day: "Mon", date: "26", note: "" },
  ];
  const slots = ["7:00 AM", "8:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"];
  return (
    <section className="page screen-scroll page--sticky-action">
      <ScreenHeader title="Schedule service" subtitle="Step 1 of 3" onBack={goBack} />
      <div className="flow-progress"><span className="active" /><span /><span /></div>
      <div className="booking-summary-compact">
        <ServiceGlyph service={service} />
        <span><small>Booking</small><strong>{service.name}</strong><em>{service.provider}</em></span>
      </div>
      <section className="form-section">
        <div className="form-title"><div><h2>Select a date</h2><p>Availability shown in your local time</p></div><CalendarDays size={21} /></div>
        <div className="date-grid">
          {dates.map((item, index) => (
            <button className={selectedDate === index ? "active" : ""} type="button" key={item.date} onClick={() => setSelectedDate(index)}>
              <span>{item.day}</span><strong>{item.date}</strong><small>{item.note || "Aug"}</small>
            </button>
          ))}
        </div>
      </section>
      <section className="form-section">
        <div className="form-title"><div><h2>Choose arrival time</h2><p>The provider may arrive within 30 minutes</p></div><Clock3 size={21} /></div>
        <div className="slot-grid">
          {slots.map((slot) => <button type="button" className={selectedSlot === slot ? "active" : ""} key={slot} onClick={() => setSelectedSlot(slot)}>{slot}</button>)}
        </div>
      </section>
      <section className="form-section">
        <div className="form-title"><div><h2>{service.unit === "acre" ? "How many acres?" : "Quantity"}</h2><p>You can confirm the final amount with the provider</p></div></div>
        <div className="quantity-control">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={20} /></button>
          <div><strong>{quantity}</strong><span>{service.unit === "worker/day" ? "workers" : service.unit + (quantity > 1 ? "s" : "")}</span></div>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus size={20} /></button>
        </div>
      </section>
      <div className="info-note"><ShieldCheck size={19} /><span><strong>Free cancellation</strong> until 6 hours before the selected time.</span></div>
      <div className="sticky-action sticky-action--single">
        <button className="button button--primary button--wide" type="button" onClick={() => go("location")}>Continue to location <ChevronRight size={19} /></button>
      </div>
    </section>
  );
}

function LocationScreen({ go, goBack, selectedAddress, setSelectedAddress }) {
  const addresses = [
    { id: "north", label: "North field", address: "Perumal Koil Road, Thiruvallur", meta: "Saved farm · 6.2 acres" },
    { id: "main", label: "Main farm", address: "Poonamallee High Road, Thiruvallur", meta: "Saved farm · 3.8 acres" },
  ];
  return (
    <section className="page screen-scroll page--sticky-action">
      <ScreenHeader title="Service location" subtitle="Step 2 of 3" onBack={goBack} />
      <div className="flow-progress"><span className="active" /><span className="active" /><span /></div>
      <div className="map-card map-card--location" aria-label="Map preview of selected farm">
        <div className="map-road map-road--one" /><div className="map-road map-road--two" />
        <div className="map-field map-field--one" /><div className="map-field map-field--two" /><div className="map-field map-field--three" />
        <span className="map-pin map-pin--farm"><MapPin size={22} fill="currentColor" /></span>
        <button className="map-locate" type="button"><LocateFixed size={18} /> Use my location</button>
      </div>
      <section className="form-section form-section--flush">
        <div className="form-title"><div><h2>Choose a saved farm</h2><p>Exact location helps the provider arrive on time</p></div></div>
        <div className="address-list">
          {addresses.map((address) => (
            <button className={`radio-card ${selectedAddress === address.id ? "active" : ""}`} type="button" key={address.id} onClick={() => setSelectedAddress(address.id)}>
              <span className="radio-card__icon"><Sprout size={21} /></span>
              <span><strong>{address.label}</strong><small>{address.address}</small><em>{address.meta}</em></span>
              <span className="radio-dot">{selectedAddress === address.id && <span />}</span>
            </button>
          ))}
        </div>
        <button className="add-address" type="button"><Plus size={19} /> Add another field or location</button>
      </section>
      <label className="note-field">
        <span>Directions for the provider <small>Optional</small></span>
        <textarea defaultValue="Enter through the blue gate near the water tank." rows="3" />
      </label>
      <div className="sticky-action sticky-action--single">
        <button className="button button--primary button--wide" type="button" onClick={() => go("payment")}>Review and pay <ChevronRight size={19} /></button>
      </div>
    </section>
  );
}

function PaymentScreen({
  goBack,
  service,
  quantity,
  pricing,
  paymentMethod,
  setPaymentMethod,
  paymentAccepted,
  setPaymentAccepted,
  paying,
  confirmPayment,
}) {
  const methods = [
    { id: "upi", label: "UPI", detail: "Google Pay, PhonePe, BHIM", icon: WalletCards },
    { id: "card", label: "Debit or credit card", detail: "Visa, Mastercard, RuPay", icon: CreditCard },
    { id: "cash", label: "Pay after service", detail: "Cash or UPI to provider", icon: IndianRupee },
  ];
  return (
    <section className="page screen-scroll page--sticky-action">
      <ScreenHeader title="Review and payment" subtitle="Step 3 of 3" onBack={goBack} />
      <div className="flow-progress"><span className="active" /><span className="active" /><span className="active" /></div>
      <div className="booking-review-card">
        <div><ServiceGlyph service={service} /><span><small>Service</small><strong>{service.name}</strong><em>Sat, 24 Aug · 8:00 AM</em></span></div>
        <button type="button" onClick={goBack}>Edit</button>
        <dl>
          <div><dt>Quantity</dt><dd>{quantity} {service.unit}{quantity > 1 ? "s" : ""}</dd></div>
          <div><dt>Location</dt><dd>North field</dd></div>
          <div><dt>Provider</dt><dd>{service.provider}</dd></div>
        </dl>
      </div>
      <section className="form-section form-section--flush">
        <div className="form-title"><div><h2>Choose payment method</h2><p>Your payment details are encrypted</p></div><LockKeyhole size={20} /></div>
        <div className="payment-list">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <button className={`payment-option ${paymentMethod === method.id ? "active" : ""}`} type="button" key={method.id} onClick={() => setPaymentMethod(method.id)}>
                <span><Icon size={21} /></span><span><strong>{method.label}</strong><small>{method.detail}</small></span><span className="radio-dot">{paymentMethod === method.id && <span />}</span>
              </button>
            );
          })}
        </div>
      </section>
      <section className="price-card">
        <h2>Price details</h2>
        <dl>
          <div><dt>Service amount</dt><dd>₹{money.format(pricing.serviceAmount)}</dd></div>
          <div><dt>Booking support fee</dt><dd>₹{pricing.serviceFee}</dd></div>
          <div><dt>Service protection</dt><dd>₹{pricing.protection}</dd></div>
          <div className="total"><dt>Total</dt><dd>₹{money.format(pricing.total)}</dd></div>
        </dl>
        <p><ShieldCheck size={17} /> Protected by AgriLink service support</p>
      </section>
      <label className="agreement-row">
        <input type="checkbox" checked={paymentAccepted} onChange={(event) => setPaymentAccepted(event.target.checked)} />
        <span>I agree to the booking, cancellation, and service safety terms.</span>
      </label>
      <div className="sticky-action">
        <div><small>Total amount</small><strong>₹{money.format(pricing.total)}</strong></div>
        <button className="button button--primary" type="button" disabled={!paymentAccepted || paying} onClick={confirmPayment}>
          {paying ? <><span className="spinner" /> Confirming…</> : <>Confirm booking <Check size={19} /></>}
        </button>
      </div>
    </section>
  );
}

function ConfirmationScreen({ go, goRoot, booking, service }) {
  return (
    <section className="confirmation screen-scroll">
      <div className="confirmation__top"><Brand /></div>
      <div className="success-mark"><span><Check size={40} strokeWidth={2.5} /></span></div>
      <span className="eyebrow">Booking confirmed</span>
      <h1>Your farm service is scheduled.</h1>
      <p>We sent the details to {service.provider}. You will receive an update before they start travelling.</p>
      <div className="ticket-card">
        <div className="ticket-card__header"><ServiceGlyph service={service} /><span><small>{booking?.id || "AGR-2052"}</small><strong>{service.name}</strong></span></div>
        <div className="ticket-card__cut"><span /><span /></div>
        <dl>
          <div><dt><CalendarDays size={17} /> Date and time</dt><dd>Sat, 24 Aug · 8:00 AM</dd></div>
          <div><dt><MapPin size={17} /> Service location</dt><dd>North field, Thiruvallur</dd></div>
          <div><dt><ReceiptText size={17} /> Amount</dt><dd>₹{money.format(booking?.amount || 2489)}</dd></div>
        </dl>
      </div>
      <div className="arrival-note"><Bell size={19} /><span><strong>We will keep you informed</strong><small>Expect an arrival update 30–45 minutes before the job.</small></span></div>
      <button className="button button--primary button--wide" type="button" onClick={() => go("tracking")}>View booking status <Route size={19} /></button>
      <button className="button button--ghost button--wide" type="button" onClick={() => goRoot("home")}>Return to home</button>
    </section>
  );
}

function BookingsScreen({ go, bookings, bookingTab, setBookingTab, setLatestBooking, setSelectedService }) {
  const visibleBookings = bookings.filter((booking) => bookingTab === "Past" ? booking.status === "Completed" : booking.status !== "Completed");
  const openBooking = (booking) => {
    setLatestBooking(booking);
    setSelectedService(services.find((service) => service.id === booking.serviceId) || services[0]);
    go("tracking");
  };
  return (
    <section className="page screen-scroll page--with-nav">
      <div className="page-heading page-heading--row"><div><span className="eyebrow">Service history</span><h1>My bookings</h1></div><button className="icon-button icon-button--soft" type="button" aria-label="Open calendar"><CalendarDays size={20} /></button></div>
      <div className="segmented-control">
        {["Upcoming", "Past"].map((tab) => <button type="button" className={bookingTab === tab ? "active" : ""} key={tab} onClick={() => setBookingTab(tab)}>{tab}</button>)}
      </div>
      <div className="booking-list">
        {visibleBookings.map((booking) => {
          const service = services.find((item) => item.id === booking.serviceId) || services[0];
          return (
            <article className="booking-card" key={booking.id}>
              <div className="booking-card__top"><ServiceGlyph service={service} /><span><small>{booking.id}</small><strong>{service.name}</strong><em>{booking.date} · {booking.time}</em></span><span className={`status-pill status-pill--${booking.status.toLowerCase().replaceAll(" ", "-")}`}>{booking.status}</span></div>
              <div className="booking-card__meta"><span><MapPin size={16} /> {booking.location}</span><span><IndianRupee size={16} /> ₹{money.format(booking.amount)}</span></div>
              <div className="booking-card__actions">
                <button className="button button--outline" type="button" onClick={() => openBooking(booking)}>{booking.status === "Completed" ? "View details" : "Track service"}</button>
                <button className="icon-button icon-button--soft" type="button" aria-label="Call provider"><Phone size={19} /></button>
              </div>
            </article>
          );
        })}
      </div>
      {!visibleBookings.length && <div className="empty-state"><CalendarCheck2 size={32} /><h2>No {bookingTab.toLowerCase()} bookings</h2><p>Your service bookings will appear here.</p></div>}
      <button className="support-banner" type="button" onClick={() => go("support")}><span className="support-banner__icon"><LifeBuoy size={22} /></span><span><strong>Issue with a booking?</strong><small>AgriLink support is available 6 AM–9 PM</small></span><ChevronRight size={19} /></button>
    </section>
  );
}

function TrackingScreen({ goBack, showToast, booking, service }) {
  const progress = booking?.progress ?? 2;
  const steps = [
    { title: "Booking confirmed", detail: "Provider accepted your request", time: "7:42 AM" },
    { title: "Provider assigned", detail: "Ravi Kumar · Verified technician", time: "8:05 AM" },
    { title: "Travelling to your farm", detail: "Estimated arrival in 18 minutes", time: "Now" },
    { title: "Service started", detail: "You will be notified", time: "Pending" },
    { title: "Job completed", detail: "Review and confirm the work", time: "Pending" },
  ];
  return (
    <section className="page screen-scroll">
      <ScreenHeader title="Track service" subtitle={booking?.id || "AGR-2048"} onBack={goBack} action={<button className="icon-button icon-button--soft" type="button" aria-label="Get help" onClick={() => showToast("Support request started")}><Headphones size={20} /></button>} />
      <div className="tracking-map" aria-label="Provider route map">
        <div className="map-road map-road--one" /><div className="map-road map-road--two" />
        <div className="tracking-route" />
        <span className="provider-pin"><Truck size={19} /></span>
        <span className="map-pin map-pin--farm"><Sprout size={19} /></span>
        <div className="eta-card"><small>Estimated arrival</small><strong>18 min</strong><span>2.4 km away</span></div>
      </div>
      <div className="provider-contact-card">
        <span className="provider-avatar provider-avatar--photo">RK</span>
        <span><small>Your service professional</small><strong>Ravi Kumar <BadgeCheck size={15} /></strong><em><Star size={14} fill="currentColor" /> 4.9 · 246 jobs completed</em></span>
        <button className="icon-button icon-button--green" type="button" aria-label="Call Ravi" onClick={() => showToast("Calling Ravi Kumar…")}><Phone size={19} /></button>
        <button className="icon-button icon-button--soft" type="button" aria-label="Message Ravi" onClick={() => showToast("Opening messages…")}><MessageCircle size={19} /></button>
      </div>
      <section className="tracking-status">
        <div className="section-heading"><div><span className="live-dot" /> Live status</div><span>Updated just now</span></div>
        <div className="timeline">
          {steps.map((step, index) => (
            <div className={`timeline-step ${index <= progress ? "complete" : ""} ${index === progress ? "current" : ""}`} key={step.title}>
              <span className="timeline-step__marker">{index < progress ? <Check size={14} /> : index + 1}</span>
              <div><strong>{step.title}</strong><small>{step.detail}</small></div><em>{step.time}</em>
            </div>
          ))}
        </div>
      </section>
      <div className="booking-detail-strip"><span><ServiceGlyph service={service} /></span><span><small>Today · 10:30 AM</small><strong>{service.name}</strong><em>North field, Thiruvallur</em></span><ChevronRight size={19} /></div>
      <button className="button button--outline button--wide" type="button" onClick={() => showToast("Arrival details shared with your provider")}><Navigation2 size={18} /> Share arrival directions</button>
      <p className="safety-copy"><ShieldCheck size={17} /> For your safety, payments and service records stay protected in AgriLink.</p>
    </section>
  );
}

function NotificationsScreen({ goBack, notifications, markAllRead }) {
  return (
    <section className="page screen-scroll">
      <ScreenHeader title="Notifications" subtitle={`${notifications.filter((item) => item.unread).length} unread updates`} onBack={goBack} action={<button className="text-button" type="button" onClick={markAllRead}>Mark all read</button>} />
      <div className="notification-list">
        {notifications.map((item) => {
          const Icon = iconMap[item.type] || Bell;
          return (
            <article className={`notification-item ${item.unread ? "unread" : ""}`} key={item.id}>
              <span className="notification-item__icon"><Icon size={21} /></span>
              <div><strong>{item.title}</strong><p>{item.body}</p><small>{item.time}</small></div>
              {item.unread && <span className="unread-dot" />}
            </article>
          );
        })}
      </div>
      <div className="info-note info-note--center"><Bell size={19} /><span>Important booking and arrival updates will always appear here.</span></div>
    </section>
  );
}

function ProfileScreen({ go, language, setLanguage, largeText, setLargeText, highContrast, setHighContrast, showToast }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  return (
    <section className="page screen-scroll page--with-nav">
      <div className="page-heading"><span className="eyebrow">Account and preferences</span><h1>My profile</h1></div>
      <div className="profile-card">
        <div className="profile-avatar">AS</div><div><strong>Arjun Selvam</strong><span>Farmer · Thiruvallur</span><small><BadgeCheck size={14} /> Phone number verified</small></div><button className="icon-button icon-button--soft" type="button" aria-label="Edit profile"><Settings2 size={19} /></button>
      </div>
      <div className="farm-card"><span><Sprout size={23} /></span><div><small>Primary farm</small><strong>North field</strong><em>6.2 acres · Paddy & groundnut</em></div><ChevronRight size={19} /></div>
      <section className="settings-group">
        <h2>Language and accessibility</h2>
        <button className="settings-row" type="button" onClick={() => setLanguageOpen(!languageOpen)}><span><Languages size={20} /></span><div><strong>App language</strong><small>{language}</small></div><ChevronDown className={languageOpen ? "rotate" : ""} size={18} /></button>
        {languageOpen && <div className="language-options">{["English", "தமிழ்", "हिन्दी"].map((item) => <button type="button" className={language === item ? "active" : ""} key={item} onClick={() => { setLanguage(item); setLanguageOpen(false); showToast(`Language set to ${item}`); }}>{item}{language === item && <Check size={16} />}</button>)}</div>}
        <ToggleRow icon={Accessibility} title="Larger text" detail="Increase text size throughout the app" active={largeText} onToggle={() => setLargeText(!largeText)} />
        <ToggleRow icon={Eye} title="High contrast" detail="Make important controls easier to see" active={highContrast} onToggle={() => setHighContrast(!highContrast)} />
      </section>
      <section className="settings-group">
        <h2>Support and account</h2>
        <SettingsLink icon={ReceiptText} title="Payments and receipts" />
        <SettingsLink icon={ShieldCheck} title="Safety and privacy" />
        <SettingsLink icon={LifeBuoy} title="Help and farmer support" onClick={() => go("support")} />
      </section>
      <div className="profile-trust"><ShieldCheck size={21} /><div><strong>Your data stays yours</strong><p>AgriLink only shares the booking details required to complete your service.</p></div></div>
      <p className="version-copy">AgriLink prototype · Version 1.0</p>
    </section>
  );
}

function SupportScreen({ goBack, showToast }) {
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    ["Can I cancel a booking?", "Yes. Cancellation is free until six hours before the scheduled arrival time. Later cancellation may include a small provider travel fee."],
    ["What if the provider does not arrive?", "Contact AgriLink support from the booking screen. We will contact the provider or help arrange another verified service."],
    ["How are providers verified?", "Identity, phone, service experience, and equipment details are reviewed before a provider can accept bookings."],
  ];
  return (
    <section className="page screen-scroll">
      <ScreenHeader title="Help and support" subtitle="Available daily, 6 AM–9 PM" onBack={goBack} />
      <div className="support-hero"><span><Headphones size={29} /></span><div><small>Farmer support</small><h1>How can we help?</h1><p>Get help with a booking, payment, provider, or app question.</p></div></div>
      <div className="support-actions">
        <button type="button" onClick={() => showToast("Calling AgriLink support…")}><span><Phone size={22} /></span><strong>Call support</strong><small>Usually answers in 2 min</small></button>
        <button type="button" onClick={() => showToast("Support chat opened")}><span><MessageCircle size={22} /></span><strong>Chat with us</strong><small>Replies in your language</small></button>
      </div>
      <section className="settings-group faq-group"><h2>Common questions</h2>{faqs.map(([question, answer], index) => <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><strong>{question}</strong><ChevronDown size={18} /></button>{openFaq === index && <p>{answer}</p>}</div>)}</section>
      <div className="info-note"><ShieldCheck size={19} /><span><strong>Emergency?</strong> AgriLink is not an emergency service. Contact local emergency services for immediate danger.</span></div>
    </section>
  );
}

function ScreenHeader({ title, subtitle, onBack, action }) {
  return (
    <header className="screen-header">
      <button className="icon-button icon-button--soft" type="button" aria-label="Go back" onClick={onBack}><ArrowLeft size={21} /></button>
      <div><h1>{title}</h1>{subtitle && <span>{subtitle}</span>}</div>
      <div className="screen-header__action">{action}</div>
    </header>
  );
}

function ServiceGlyph({ service }) {
  const Icon = iconMap[service.icon] || Wrench;
  return <span className={`service-glyph service-art--${service.tone}`}><Icon size={23} /></span>;
}

function SectionHeading({ title, action, onAction }) {
  return <div className="section-heading"><h2>{title}</h2><button type="button" onClick={onAction}>{action} <ChevronRight size={16} /></button></div>;
}

function ToggleRow({ icon: Icon, title, detail, active, onToggle }) {
  return <button className="settings-row" type="button" onClick={onToggle} aria-pressed={active}><span><Icon size={20} /></span><div><strong>{title}</strong><small>{detail}</small></div><span className={`toggle ${active ? "active" : ""}`}><span /></span></button>;
}

function SettingsLink({ icon: Icon, title, onClick }) {
  return <button className="settings-row" type="button" onClick={onClick}><span><Icon size={20} /></span><div><strong>{title}</strong></div><ChevronRight size={18} /></button>;
}

function BottomNav({ active, onNavigate }) {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Search },
    { id: "bookings", label: "Bookings", icon: CalendarCheck2 },
    { id: "profile", label: "Profile", icon: UserRound },
  ];
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map((item) => {
        const Icon = item.icon;
        return <button className={active === item.id ? "active" : ""} type="button" key={item.id} onClick={() => onNavigate(item.id)}><Icon size={21} strokeWidth={active === item.id ? 2.5 : 2} /><span>{item.label}</span></button>;
      })}
    </nav>
  );
}

export default App;
