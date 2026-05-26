class Store {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(updater) {
    const nextState = typeof updater === 'function' ? updater(this.state) : updater;
    this.state = { ...this.state, ...nextState };
    this.notify();
    this.saveToLocal();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  saveToLocal() {
    try {
      localStorage.setItem('vl_studio_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }

  loadFromLocal() {
    try {
      const saved = localStorage.getItem('vl_studio_state');
      if (saved) {
        this.state = JSON.parse(saved);
        this.notify();
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
  }
}

// Default initial state
const initialState = {
  view: 'single-card',
  format: '4:5',
  branding: {
    accentCyan: '#00c6ff',
    accentBlue: '#0072ff',
    accentPurple: '#6e45e2',
    bgMain: '#0b0e14',
    bgSurface: '#161b22',
  },
  singleCard: {
    name: 'Alofoke Radio Show',
    handle: '@alofokeradioshow',
    category: 'Entertainment',
    rank: '#1',
    metricMainValue: '313M',
    metricMainLabel: 'TOTAL VIEWS',
    subs: '5.2M',
    earnings: '$120K+',
    trendValue: '+42%',
    trendType: 'up', // up, down
    badge: '👑 Most Viewed',
    avatar: 'https://i.pravatar.cc/300', // Base64 later
    showVerified: true,
    showGlow: true,
    showFlag: true,
  },
  topRanking: {
    title: 'MOST VIEWED',
    subtitle: 'DOMINICAN CREATORS',
    period: 'LAST 30 DAYS',
    items: [
      { id: 1, name: 'Alofoke Radio Show', cat: 'Entertainment', views: '313M', subs: '5.2M', trend: '+42%', trendType: 'up', avatar: 'https://i.pravatar.cc/150?img=11' },
      { id: 2, name: 'El Dotol Nastra', cat: 'Entertainment', views: '185M', subs: '3.1M', trend: '+15%', trendType: 'up', avatar: 'https://i.pravatar.cc/150?img=12' },
      { id: 3, name: 'Capricornio TV', cat: 'Entertainment', views: '150M', subs: '2.8M', trend: '+5%', trendType: 'up', avatar: 'https://i.pravatar.cc/150?img=13' },
      { id: 4, name: 'Jessica Pereira', cat: 'Podcast', views: '95M', subs: '1.5M', trend: '+22%', trendType: 'up', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: 5, name: 'Luinny Corporan', cat: 'Entertainment', views: '80M', subs: '1.2M', trend: '-2%', trendType: 'down', avatar: 'https://i.pravatar.cc/150?img=15' }
    ]
  }
};

export const store = new Store(initialState);
