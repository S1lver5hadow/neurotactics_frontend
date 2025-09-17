import React from 'react';
import feature1 from '../assets/feature1.png';
import feature2 from '../assets/feature2.png';
import feature3 from '../assets/feature3.png';

const HomeSummerySection = () => {
  const features = [
    {
      title: "Feature One",
      description: "Description of the first feature. This explains why it's awesome.",
      image: feature1,
    },
    {
      title: "Feature Two",
      description: "Description of the second feature. It's even better than the first.",
      image: feature2,
    },
    {
      title: "Feature Three",
      description: "Description of the third feature. The best one yet!",
      image: feature3,
    },
  ];

  return (
  <section className="section home-summery-section"
  style={{
    backgroundImage: 'url("/features_screen_background.jpg")',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
  }}
   id="home-summery">
    <h2 className="section-title">Our Features</h2>
      <div className="horizontal-scroll">
      {features.map((feature, index) => (
          <div
            className="feature-card"
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '5vw',
              width: '30vw',
              height: '45vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
              transition: 'transform 0.3s',
              transform: 'translateY(-20px)'

            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="feature-image"
              style={{ width: '90%', height: '60%', objectFit: 'contain', borderRadius: '1vw' }}
            />
            <h3 className="feature-title" style={{ fontSize: '1.8vw', margin: '1vh 0', color: 'orange' }}>
              {feature.title}
            </h3>
            <p className="feature-description" style={{ fontSize: '1.2vw', maxWidth: '90%' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSummerySection;
