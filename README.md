# 🚨 Hybrid Real-Time Event Detection System

A comprehensive real-time event detection system that uses **Computer Vision** and **Natural Language Processing** to detect traffic incidents (accidents, fires, dense/sparse traffic) in New Zealand. The system combines image analysis from traffic cameras with text message analysis to provide accurate, location-aware event detection.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Models](#-models)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Capabilities
- **🖼️ Image-Based Detection**: Uses ResNet18 CNN to analyze traffic camera images
- **📝 Text-Based Detection**: Uses DistilBERT transformer for analyzing text messages/tweets
- **🔀 Intelligent Fusion**: Rule-based fusion algorithm combines predictions from both models
- **📍 Location Extraction**: Automatically extracts location information from text messages
- **🗺️ Interactive Map**: Real-time visualization of events on an interactive map
- **📊 Event Severity Classification**: Categorizes events as Critical, High, Medium, or Low priority
- **🔄 Real-Time Updates**: Continuous monitoring with automatic event detection and updates

### Event Types Detected
- 🔥 **Fire** (Critical severity)
- 🚗 **Accident** (High severity)
- 🚦 **Dense Traffic** (Medium severity)
- ✅ **Sparse Traffic** (Low severity)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **PyTorch** - Deep learning framework
- **Transformers** - Hugging Face transformers library for NLP
- **ResNet18** - Convolutional Neural Network for image classification
- **DistilBERT** - Lightweight transformer model for text classification
- **Pillow (PIL)** - Image processing
- **Pandas** - Data manipulation
- **Uvicorn** - ASGI server

### Frontend
- **React 19** - UI library
- **React Leaflet** - Interactive maps
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 🏗️ Architecture

The system uses a hybrid approach with two parallel detection pipelines:

1. **Image Pipeline**: Traffic camera images → ResNet18 → Event prediction
2. **Text Pipeline**: Text messages/tweets → DistilBERT → Event prediction
3. **Fusion Layer**: Combines both predictions using rule-based logic:
   - **Agreement**: When both models agree, confidence is boosted
   - **Conflict Resolution**: Severity hierarchy (Fire > Accident > Dense Traffic > Sparse Traffic)
   - **Location Priority**: Text-extracted locations take precedence

## 📁 Project Structure

```
.
├── backend/
│   ├── main.py                 # Main FastAPI application
│   ├── check_server.py         # Server health check script
│   ├── image.py                # Image downloading utility
│   ├── server.py               # Additional server configuration
│   ├── requirements.txt        # Python dependencies
│   ├── run_server.bat          # Windows server startup script
│   ├── models/
│   │   ├── best_model.pth      # Trained ResNet18 model
│   │   └── tweet_transformer_model/  # DistilBERT model files
│   └── static/
│       ├── demo_images/        # Sample images for simulation
│       └── tweets.csv          # Sample text messages
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── components/
│   │   │   ├── MapView.jsx     # Interactive map component
│   │   │   └── Sidebar.jsx     # Event sidebar component
│   │   └── ...
│   ├── package.json            # Node.js dependencies
│   └── ...
└── README.md                   # This file
```

## 🚀 Installation

### Prerequisites

- **Python 3.8+** (Note: Python 3.13+ has compatibility issues with `snscrape`)
- **Node.js 16+** and npm/yarn
- **CUDA-capable GPU** (optional, for faster inference)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify models are present:**
   - Check that `backend/models/best_model.pth` exists
   - Check that `backend/models/tweet_transformer_model/` directory exists with model files

5. **Verify demo images:**
   - Ensure `backend/static/demo_images/` contains sample images
   - Ensure `backend/static/tweets.csv` exists with text messages

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

## 📖 Usage

### Starting the Backend

1. **Activate virtual environment** (if using one):
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   # or
   source venv/bin/activate  # Linux/Mac
   ```

2. **Run the server:**
   ```bash
   python main.py
   ```
   
   Or on Windows:
   ```bash
   run_server.bat
   ```

3. **Verify server is running:**
   - Server starts on `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`
   - Check server status: `python check_server.py`

### Starting the Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

3. **Open browser:**
   - Frontend runs on `http://localhost:3000`
   - Automatically connects to backend at `http://localhost:8000`

### System Modes

The system operates in two modes:

#### Simulation Mode (Default)
- Uses demo images from `backend/static/demo_images/`
- Uses text messages from `backend/static/tweets.csv`
- No external API calls required
- Perfect for development and testing

#### Live Mode
- Connects to real traffic camera APIs
- Scrapes Twitter for real-time tweets (requires `snscrape`)
- Set `USE_SIMULATION = False` in `backend/main.py`

## 📡 API Documentation

### Endpoints

#### `GET /api/cameras`
Returns list of all cameras and their status.

**Response:**
```json
[
  {
    "id": 1,
    "lat": -36.8485,
    "lon": 174.7633,
    "location": "Auckland",
    "status": "active",
    "last_event": "Accident",
    "confidence": 0.85
  }
]
```

#### `GET /api/events`
Returns recent events sorted by timestamp.

**Response:**
```json
[
  {
    "id": "fusion120240101",
    "source": "fusion",
    "camera_id": 5,
    "event_type": "Fire",
    "confidence": 0.92,
    "severity": "critical",
    "lat": -41.2865,
    "lon": 174.7762,
    "location": "Wellington",
    "timestamp": "2024-01-01T12:00:00",
    "description": "Fire detected at Wellington",
    "text_message": "Fire reported on State Highway 16"
  }
]
```

#### `GET /api/camera/{camera_id}`
Returns current image from a specific camera.

**Response:** JPEG image

#### `GET /api/stats`
Returns system statistics.

**Response:**
```json
{
  "total_cameras": 20,
  "active_cameras": 20,
  "total_events": 15,
  "event_breakdown": {
    "Fire": 2,
    "Accident": 5,
    "Dense Traffic": 8
  },
  "text_messages_loaded": 25,
  "last_update": "2024-01-01T12:00:00"
}
```

#### `GET /api/text-messages`
Returns loaded text messages.

#### `GET /api/text/predict?text={text}`
Predicts event type from a text string.

**Query Parameters:**
- `text` (string): Text to analyze

**Response:**
```json
{
  "input_text": "Major accident on Highway 1",
  "predicted_class_index": 0,
  "class_name": "Accident",
  "confidence": 0.89,
  "severity": "high"
}
```

### Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

## ⚙️ Configuration

### Backend Configuration (`backend/main.py`)

Key configuration options in the `CFG` class:

```python
USE_SIMULATION = True  # Enable simulation mode
POLL_INTERVAL = 300    # Camera polling interval (seconds)
TEXT_POLL_INTERVAL = 30  # Text polling interval (seconds)
NUM_CAMERAS = 20       # Number of simulated cameras
DEVICE = "cuda"        # "cuda" or "cpu"
```

### Location Configuration

The system is pre-configured for New Zealand locations:
- Auckland, Wellington, Christchurch, Hamilton, Tauranga, Dunedin, Palmerston North, Napier, Nelson, Rotorua, Porirua

To add more locations, edit the `NZ_LOCATIONS` list in `backend/main.py`.

## 🤖 Models

### ResNet18 Image Classification Model
- **Purpose**: Classify traffic camera images
- **Classes**: Accident, Dense Traffic, Fire, Sparse Traffic
- **Input**: 224x224 RGB images
- **Location**: `backend/models/best_model.pth`

### DistilBERT Text Classification Model
- **Purpose**: Classify text messages/tweets
- **Classes**: Accident, Dense Traffic, Fire, Sparse Traffic
- **Input**: Text strings (max 128 tokens)
- **Location**: `backend/models/tweet_transformer_model/`

### Model Training

The models were trained on custom datasets. To retrain:

1. **Image Model**: Train ResNet18 on labeled traffic camera images
2. **Text Model**: Fine-tune DistilBERT on labeled text messages

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Server fails to start
- **Solution**: Check that all dependencies are installed: `pip install -r requirements.txt`
- **Solution**: Verify Python version (3.8-3.12 recommended)
- **Solution**: Check that models exist in `backend/models/`

**Problem**: Models not loading
- **Solution**: Verify model files are present and not corrupted
- **Solution**: Check device availability: `torch.cuda.is_available()`

**Problem**: No events detected
- **Solution**: Check that `backend/static/tweets.csv` exists and has data
- **Solution**: Verify demo images are in `backend/static/demo_images/`
- **Solution**: Wait 30 seconds for first polling cycle

### Frontend Issues

**Problem**: Cannot connect to backend
- **Solution**: Verify backend is running on `http://localhost:8000`
- **Solution**: Check CORS settings in backend
- **Solution**: Verify `API_BASE_URL` in `frontend/src/App.js`

**Problem**: Map not displaying
- **Solution**: Check Leaflet CSS is imported
- **Solution**: Verify internet connection (for map tiles)

### Common Errors

**`snscrape` not available (Python 3.13+)**
- This is expected. The system will continue with CSV text messages.
- Twitter scraping is disabled in simulation mode anyway.

**CUDA out of memory**
- Reduce batch size or use CPU: Set `DEVICE = "cpu"` in `backend/main.py`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation as needed

## 📝 License

This project is part of a Capstone Project. All rights reserved.

## 👥 Authors

- **Naman Shah** - Initial work

## 🙏 Acknowledgments

- New Zealand Transport Agency for traffic camera APIs
- Hugging Face for pre-trained transformer models
- PyTorch team for deep learning framework
- React and Leaflet communities for excellent libraries

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Note**: This system is designed for demonstration and research purposes. For production use, additional security, error handling, and scalability considerations should be implemented.

