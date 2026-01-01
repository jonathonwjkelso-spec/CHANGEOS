# ChangeOS

**Real-Time Organisational Change Sensing Platform**

See what's actually happening in your change initiative. ChangeOS analyses project data through predictive lenses to surface risks before they become failures.

![ChangeOS Dashboard](https://via.placeholder.com/800x450/0f172a/06b6d4?text=ChangeOS+Dashboard)

## Features

- **Predictive Risk Analysis** — Adoption Cliff, Attrition Risk, and Technical Debt predictions
- **Signal Cluster Mapping** — Training effectiveness, manager readiness, resistance patterns, support infrastructure, and leadership engagement
- **Say/Do Gap Detection** — Surface the delta between official narrative and ground truth
- **Intervention Window Tracking** — Know when you still have time to act
- **Trajectory Visualisation** — See how risks evolved over time

## Demo Mode

The app includes pre-loaded data from "Project Horizon" — a synthetic finance system migration case study that demonstrates the platform's analytical capabilities.

## Deployment to GitHub Pages

### Step 1: Create a GitHub Account

If you don't have one, go to [github.com](https://github.com) and sign up.

### Step 2: Create a New Repository

1. Click the **+** icon in the top right → **New repository**
2. Name it `changeos`
3. Keep it **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 3: Upload the Files

**Option A: GitHub Web Interface (Easiest)**
1. In your new repository, click **uploading an existing file**
2. Drag and drop all files from the `dist` folder
3. Click **Commit changes**

**Option B: Git Command Line**
```bash
cd dist
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/changeos.git
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under "Source", select **Deploy from a branch**
3. Select **main** branch and **/ (root)** folder
4. Click **Save**

### Step 5: Access Your Site

After a few minutes, your site will be live at:
```
https://YOUR-USERNAME.github.io/changeos/
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

- React 18 + Vite
- Tailwind CSS v4
- Recharts for data visualisation
- Lucide React for icons

## Future Development

The demo version shows pre-computed analysis. Future versions could include:

- Live Claude API integration for real-time analysis
- Multiple initiative support
- Data import/export
- Custom lens configuration
- Team collaboration features

## Author

**Jonathon Tonkin**  
Master of Change & Organisational Resilience  
15+ years in NZ public sector change and transformation

## License

MIT License - Feel free to use and adapt for your own purposes.
