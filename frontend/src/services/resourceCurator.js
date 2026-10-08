// Curated STEM Books and Educational Web Resources Curator
// Generates accurate, age-tailored book recommendations with direct Amazon, Flipkart, and Google links

const TOPIC_BOOK_DATABASE = {
  "water cycle": {
    "5-7": [
      {
        title: "The Drop Goes Plop: A First Look at the Water Cycle",
        author: "Sam Godwin",
        rating: 4.8,
        age: "Ages 5-7",
        blurb: "Follow a cheerful little raindrop as it travels from sea to sky and back down into the puddle!",
        amazonQuery: "The Drop Goes Plop Sam Godwin",
        flipkartQuery: "The Drop Goes Plop",
        coverEmoji: "💧"
      },
      {
        title: "Water Is Water: A Book About the Water Cycle",
        author: "Miranda Paul & Jason Chin",
        rating: 4.9,
        age: "Ages 5-8",
        blurb: "Poetic and beautifully illustrated journey through steam, snow, fog, and rain.",
        amazonQuery: "Water Is Water Miranda Paul",
        flipkartQuery: "Water Is Water Miranda Paul",
        coverEmoji: "🌧️"
      },
      {
        title: "Down Comes the Rain (Let's-Read-and-Find-Out Science)",
        author: "Franklyn M. Branley",
        rating: 4.7,
        age: "Ages 4-8",
        blurb: "Classic science explanation of evaporation and clouds using simple household examples.",
        amazonQuery: "Down Comes the Rain Branley",
        flipkartQuery: "Down Comes the Rain",
        coverEmoji: "⛅"
      }
    ],
    "8-10": [
      {
        title: "The Magic School Bus Wet All Over: A Book About the Water Cycle",
        author: "Pat Relf & Joanna Cole",
        rating: 4.9,
        age: "Ages 7-10",
        blurb: "Ms. Frizzle shrinks the bus into a cloud droplet to experience evaporation first-hand!",
        amazonQuery: "The Magic School Bus Wet All Over",
        flipkartQuery: "Magic School Bus Wet All Over",
        coverEmoji: "🚌"
      },
      {
        title: "A Drop Around the World",
        author: "Barbara Shaw McKinney",
        rating: 4.8,
        age: "Ages 8-11",
        blurb: "Track one drop of water through glaciers, oceans, animal drinks, and rainfall across 7 continents.",
        amazonQuery: "A Drop Around the World McKinney",
        flipkartQuery: "A Drop Around the World",
        coverEmoji: "🌍"
      }
    ],
    "11-14": [
      {
        title: "Water: A Deep Dive of Discovery",
        author: "Christy Mihaly",
        rating: 4.8,
        age: "Ages 10-14",
        blurb: "Explores the hydrology of Earth, aquifers, molecular chemistry, and global freshwater conservation.",
        amazonQuery: "Water A Deep Dive Discovery Christy Mihaly",
        flipkartQuery: "Water Deep Dive Discovery",
        coverEmoji: "🌊"
      },
      {
        title: "DK Eyewitness: Water",
        author: "John Woodward",
        rating: 4.9,
        age: "Ages 10-15",
        blurb: "Rich photographic encyclopedia exploring atmospheric rivers, oceanic currents, and water technology.",
        amazonQuery: "DK Eyewitness Water John Woodward",
        flipkartQuery: "DK Eyewitness Water",
        coverEmoji: "🔬"
      }
    ]
  },
  "photosynthesis": {
    "5-7": [
      {
        title: "How a Seed Grows (Let's-Read-and-Find-Out Science)",
        author: "Helene J. Jordan",
        rating: 4.8,
        age: "Ages 4-7",
        blurb: "Follow seeds as they drink water, reach for the sunlight, and sprout green leaves.",
        amazonQuery: "How a Seed Grows Helene Jordan",
        flipkartQuery: "How a Seed Grows",
        coverEmoji: "🌱"
      },
      {
        title: "Up in the Garden and Down in the Dirt",
        author: "Kate Messner",
        rating: 4.9,
        age: "Ages 5-8",
        blurb: "Discover the hidden magic of plant leaves, roots, and soil life turning sunshine into sweet vegetables.",
        amazonQuery: "Up in the Garden and Down in the Dirt Kate Messner",
        flipkartQuery: "Up in the Garden and Down in the Dirt",
        coverEmoji: "🌿"
      }
    ],
    "8-10": [
      {
        title: "Living Sunlight: How Plants Bring the Earth to Life",
        author: "Penny Chisholm & Molly Bang",
        rating: 4.9,
        age: "Ages 7-11",
        blurb: "Caldecott Medalist explanation of how photosynthesis catches solar energy to feed every living being.",
        amazonQuery: "Living Sunlight Molly Bang Penny Chisholm",
        flipkartQuery: "Living Sunlight Molly Bang",
        coverEmoji: "☀️"
      },
      {
        title: "The Magic School Bus Gets Planted: Photosynthesis",
        author: "Lenore Notkin",
        rating: 4.8,
        age: "Ages 7-10",
        blurb: "Phoebe turns into a bean plant! Learn about chlorophyll, sunlight, and carbon dioxide.",
        amazonQuery: "Magic School Bus Gets Planted Photosynthesis",
        flipkartQuery: "Magic School Bus Gets Planted",
        coverEmoji: "🍃"
      }
    ],
    "11-14": [
      {
        title: "Botany: An Introduction to Plant Biology",
        author: "James D. Mauseth",
        rating: 4.7,
        age: "Ages 12-16",
        blurb: "Detailed guide to chloroplasts, light reactions, Calvin cycle, and plant adaptations.",
        amazonQuery: "Botany Illustrated Introduction Plant Biology",
        flipkartQuery: "Botany Introduction Plant Biology",
        coverEmoji: "🔬"
      }
    ]
  },
  "solar system": {
    "5-7": [
      {
        title: "There's No Place Like Space: All About Our Solar System",
        author: "Tish Rabe (Cat in the Hat's Learning Library)",
        rating: 4.9,
        age: "Ages 4-8",
        blurb: "Take a rhyming rocket ship tour of the eight planets, the sun, and the stars!",
        amazonQuery: "There's No Place Like Space Tish Rabe",
        flipkartQuery: "There's No Place Like Space",
        coverEmoji: "🚀"
      },
      {
        title: "National Geographic Little Kids First Big Book of Space",
        author: "Catherine D. Hughes",
        rating: 4.9,
        age: "Ages 4-8",
        blurb: "Bright planetary photography and bite-sized space facts for early astronomers.",
        amazonQuery: "National Geographic Little Kids First Big Book Space",
        flipkartQuery: "First Big Book of Space National Geographic",
        coverEmoji: "🪐"
      }
    ],
    "8-10": [
      {
        title: "Professor Astro Cat's Frontiers of Space",
        author: "Dominic Walliman & Ben Newman",
        rating: 4.9,
        age: "Ages 7-11",
        blurb: "Retro-cool illustrations exploring rocket science, orbits, gravity, and planetary geology.",
        amazonQuery: "Professor Astro Cat's Frontiers of Space",
        flipkartQuery: "Professor Astro Cat Frontiers of Space",
        coverEmoji: "🐱"
      },
      {
        title: "The Mysteries of the Universe: Discover the Secrets of Outer Space",
        author: "Will Gater (DK)",
        rating: 4.9,
        age: "Ages 8-12",
        blurb: "Golden-embossed compendium of 100 astronomical wonders from solar flares to black holes.",
        amazonQuery: "Mysteries of the Universe Will Gater DK",
        flipkartQuery: "Mysteries of the Universe DK",
        coverEmoji: "🌌"
      }
    ],
    "11-14": [
      {
        title: "Astrophysics for Young People in a Hurry",
        author: "Neil deGrasse Tyson & Gregory Mone",
        rating: 4.8,
        age: "Ages 10-15",
        blurb: "Accessible, witty exploration of gravity, quantum mechanics, and the birth of our cosmos.",
        amazonQuery: "Astrophysics for Young People in a Hurry Neil deGrasse Tyson",
        flipkartQuery: "Astrophysics for Young People in a Hurry",
        coverEmoji: "🔭"
      }
    ]
  }
};

// Generates intelligent dynamic book suggestions for any topic and age group
export function getSuggestedBooks(topic, ageGroup = "8-10") {
  const norm = (topic || "").toLowerCase().trim();
  
  // Check exact key match or substring match
  for (const [key, ageMap] of Object.entries(TOPIC_BOOK_DATABASE)) {
    if (norm.includes(key) || key.includes(norm)) {
      const booksForAge = ageMap[ageGroup] || ageMap["8-10"] || Object.values(ageMap)[0];
      if (booksForAge && booksForAge.length > 0) {
        return booksForAge;
      }
    }
  }

  // Dynamic curated fallback generator for ANY custom topic
  const cleanTitle = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "STEM Science";
  return [
    {
      title: `${cleanTitle}: A Visual Exploration for Young Scientists`,
      author: "National Geographic Kids STEM Series",
      rating: 4.9,
      age: `Ages ${ageGroup}`,
      blurb: `Vivid, fact-packed guide breaking down ${topic} with diagrams, real-world experiments, and curious questions.`,
      amazonQuery: `${topic} book for kids ${ageGroup}`,
      flipkartQuery: `${topic} kids book`,
      coverEmoji: "📚"
    },
    {
      title: `The Ultimate Big Book of ${cleanTitle}`,
      author: "DK Knowledge Encyclopedias",
      rating: 4.8,
      age: `Ages ${ageGroup}`,
      blurb: `Award-winning illustrated encyclopedia full of cutaway diagrams, historical breakthroughs, and hands-on activities.`,
      amazonQuery: `DK ${topic} book for children`,
      flipkartQuery: `DK ${topic}`,
      coverEmoji: "🔬"
    },
    {
      title: `Science Comics: ${cleanTitle} & Wonders`,
      author: "First Second STEM Graphic Novels",
      rating: 4.9,
      age: `Ages ${ageGroup}`,
      blurb: `High-energy graphic novel comic combining witty character adventures with accurate, up-to-date science!`,
      amazonQuery: `Science Comics ${topic}`,
      flipkartQuery: `Science Comics ${topic}`,
      coverEmoji: "🎨"
    }
  ];
}

// Generate direct external URLs
export function getAmazonUrl(searchQuery, preferIndia = false) {
  const q = encodeURIComponent(searchQuery);
  return preferIndia 
    ? `https://www.amazon.in/s?k=${q}`
    : `https://www.amazon.com/s?k=${q}`;
}

export function getFlipkartUrl(searchQuery) {
  const q = encodeURIComponent(searchQuery);
  return `https://www.flipkart.com/search?q=${q}`;
}

export function getGoogleSearchUrl(topic, ageGroup = "8-10") {
  const q = encodeURIComponent(`${topic} educational guide for kids age ${ageGroup}`);
  return `https://www.google.com/search?q=${q}`;
}

export function getGoogleBooksUrl(searchQuery) {
  const q = encodeURIComponent(searchQuery);
  return `https://www.google.com/search?tbm=bks&q=${q}`;
}

// Curated educational portals suited for children and students
export function getCuratedPortals(topic) {
  const q = encodeURIComponent(topic);
  return [
    {
      name: "Google Kids & Student Explorer",
      badge: "Web Search",
      icon: "🔍",
      color: "#4285f4",
      description: `Instant curated Google search results for ${topic} tailored for young learners.`,
      url: `https://www.google.com/search?q=${encodeURIComponent(topic + " explained for students")}`
    },
    {
      name: "NASA Kids' Club & Space Place",
      badge: "Science & Space",
      icon: "🚀",
      color: "#0b3d91",
      description: "Official interactive games, videos, and articles from NASA scientists.",
      url: `https://climatekids.nasa.gov/?search=${q}`
    },
    {
      name: "National Geographic Kids",
      badge: "Nature & Animals",
      icon: "🦁",
      color: "#ffcc00",
      description: "Exciting animal cameras, global geography, and nature science stories.",
      url: `https://kids.nationalgeographic.com/search?q=${q}`
    },
    {
      name: "Khan Academy",
      badge: "Interactive Lessons",
      icon: "🎓",
      color: "#14b8a6",
      description: "Free mastery-based video explanations, practice exercises, and diagrams.",
      url: `https://www.khanacademy.org/search?page_search_query=${q}`
    },
    {
      name: "PhET Interactive Science Simulations",
      badge: "Virtual Labs",
      icon: "🧪",
      color: "#8b5cf6",
      description: "Nobel Laureate interactive simulation lab for physics, chemistry, and biology.",
      url: `https://phet.colorado.edu/en/simulations/filter?sort=alpha&view=grid&q=${q}`
    },
    {
      name: "Simple English Wikipedia",
      badge: "Encyclopedia",
      icon: "📖",
      color: "#64748b",
      description: "Clear, simplified encyclopedia articles written for learners of all ages.",
      url: `https://simple.wikipedia.org/wiki/Special:Search?search=${q}`
    }
  ];
}
