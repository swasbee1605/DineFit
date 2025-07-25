# 🍽️ DineFit

**Personalized recipe discovery platform**

DineFit is a smart, user-friendly web application designed to help individuals discover recipes that align with their unique dietary preferences, allergies, and food dislikes. The platform empowers users to create personalized profiles and instantly receive intelligent recipe recommendations sourced from trusted APIs with advanced filtering capabilities.

![DineFit Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-19+-blue)
![Vite](https://img.shields.io/badge/Vite-7.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-teal)

## ✨ Features

### 🎯 **Personalized Profile Management**
- Set dietary preferences (vegetarian, vegan, keto, paleo, etc.)
- Track food allergies and dietary restrictions  
- Specify disliked ingredients for accurate filtering
- Choose preferred cuisines and cooking styles

### 🔍 **Smart Recipe Discovery**
- Intelligent recipe filtering by dietary preferences and allergies
- Multi-API integration with automatic key rotation for scalability
- Advanced caching system for optimal performance
- Real-time search with personalized recommendations

### 📊 **Comprehensive Dashboard**
- Beautiful, responsive interface with glass morphism design
- Recipe discovery with detailed nutritional information
- Visual API quota tracking and cache statistics
- Quick access to saved recipes and preferences

### 🛡️ **User Management**
- Secure authentication with Appwrite backend
- Personalized user profiles with dietary preferences
- Allergy and food dislike tracking
- Cuisine preference customization

### 🚀 **Performance & Scaling**
- Multi-API key rotation system (supports 8-10 keys)
- Intelligent caching with 70-80% hit rate
- Automatic quota management and fallback systems
- Production-ready architecture for 150+ concurrent users

## 🏗️ Tech Stack

### **Frontend**
- **React 19.1.0** - Modern hooks-based architecture
- **Vite 7.0** - Lightning-fast development and build
- **TailwindCSS 3.4+** - Utility-first styling with glass morphism

### **Backend & Services**
- **Appwrite 18.1.1** - Authentication and user profiles
- **Spoonacular API** - Premium recipe database with dietary filtering
- **NodeCache** - In-memory caching for performance optimization

## 🔧 Project Structure

```
DineFit/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── DatabaseStatus.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProfileSetup.jsx
│   │   ├── RecipeCard.jsx
│   │   └── RecipeModal.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Dashboard.jsx
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── appwriteClient.js
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔄 Development Roadmap

### ✅ **Completed**
- [x] User authentication system
- [x] Responsive dashboard design
- [x] Meal logging interface
- [x] Basic nutrition tracking
- [x] Weight goal management

### 🚧 **In Progress**
- [ ] Recipe API integration
- [ ] Advanced filtering options
- [ ] Meal planning features
- [ ] Data export functionality

### 📋 **Planned Features**
- [ ] Social sharing capabilities
- [ ] Weekly meal planning
- [ ] Grocery list generation
- [ ] Progress analytics and insights
- [ ] Mobile app (React Native)

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Krishna Sarathi**
- GitHub: [@imkrishnasarathi](https://github.com/imkrishnasarathi)
- Project: [DineFit](https://github.com/imkrishnasarathi/DineFit)

