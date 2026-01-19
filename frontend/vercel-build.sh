cd frontend
cat > vercel-build.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting DhakaAgro build..."
npm install
npm run build
echo "✅ Build completed!"
EOF

chmod +x vercel-build.sh

# Update package.json
cat > package.json << 'EOF'
{
  "name": "dhakaagro",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "build": "./vercel-build.sh",
    "test": "react-scripts test"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
EOF