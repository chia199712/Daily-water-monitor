# Daily Water Monitor

A Progressive Web App designed for tracking daily water intake with offline support and smart reminders.

## Key Features

### 💧 Water Tracking
- **Quick Record**: Preset buttons for 250ml, 500ml, 750ml
- **Custom Amount**: Input any water amount
- **Edit Records**: Modify or delete recorded water intake
- **Timestamp**: Automatically record the time of each intake
- **Notes**: Add notes to each record

### 📊 Data Analytics
- **Daily Progress**: Circular progress bar showing today's completion
- **Daily Goals**: Set personalized daily water intake targets
- **Weekly Trends**: View past week's water intake trends
- **Average Statistics**: Calculate daily average water consumption
- **Streak Counter**: Track consecutive days of meeting goals
- **History View**: Browse past water intake records

### 🔔 Smart Reminders
- **Scheduled Reminders**: Set reminder intervals (15 minutes - 8 hours)
- **Working Hours**: Set reminder time range to avoid nighttime interruptions
- **Personalized Settings**: Suggest water intake based on weight and activity level
- **Browser Notifications**: Receive reminders even when not on the page
- **Flexible Control**: Enable or disable reminders anytime

### 📱 PWA Features
- **Offline Usage**: Record and view data without internet connection
- **Install to Desktop**: Install on mobile or computer home screen
- **Responsive Design**: Auto-adapt to mobile, tablet, and computer screens
- **Fast Loading**: Smart caching strategy for quick startup
- **Background Sync**: Auto-sync data when internet is restored

### 🔒 Privacy Protection
- **Local Storage**: All data stored on your device
- **No Registration**: No account needed, just open and use
- **Data Export**: Export data in JSON format for backup
- **Completely Offline**: No data sent to any servers

## How to Use

### Basic Operations
1. **Record Water**: Click quick buttons or "Custom" to input water amount
2. **View Progress**: Main screen circular chart shows daily completion
3. **Set Goals**: Adjust daily water targets in settings page
4. **Enable Reminders**: Set reminder intervals and working hours

### Personalization
1. **Weight Setting**: Input weight to get suggested water intake
2. **Activity Level**: Choose low/moderate/high activity level for adjustments
3. **Reminder Times**: Set reminder time range that fits your schedule
4. **Notification Permission**: Allow browser notifications to receive reminders

### Data Management
- **View Statistics**: Check detailed data analysis in statistics page
- **Edit Records**: Long press records to edit or delete
- **Clear Data**: Clear all historical data in settings
- **Data Backup**: Export JSON file for backup

## Browser Support

- Chrome 88+ (Recommended)
- Firefox 85+
- Safari 14+
- Edge 88+

## Installation

### Mobile Installation
1. Open the website in your browser
2. Tap "Add to Home Screen" or "Install"
3. Confirm installation, app will appear on desktop

### Desktop Installation
1. Open website in Chrome or Edge
2. Install icon will appear in address bar
3. Click install, app will be added to applications

## Development

```bash
npm install
npm run dev
```