import { useState } from 'react';
import UploadSection from './components/UploadSection.tsx';
import PredictSection from './components/PredictSection.tsx';
import StatsSection from './components/StatsSection.tsx';
import HomeSection from './components/HomeSection.tsx';



type Section = 'home' | 'upload' | 'predict' | 'stats';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  return (
    <div>
      <nav>
		<button onClick={() => setActiveSection('home')}>Home</button>
        <button onClick={() => setActiveSection('upload')}>Upload</button>
        <button onClick={() => setActiveSection('predict')}>Predict</button>
        <button onClick={() => setActiveSection('stats')}>Stats</button>
      </nav>
	  {activeSection === 'home' && <HomeSection />}
      {activeSection === 'upload' && <UploadSection />}
      {activeSection === 'predict' && <PredictSection />}
      {activeSection === 'stats' && <StatsSection />}
    </div>
  );
}