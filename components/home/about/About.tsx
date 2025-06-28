import Image from "next/image";

interface AboutProps {
  visibleElements: Set<string>;
}

const About: React.FC<AboutProps> = ({ visibleElements }) => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 
          id="about-title"
          data-animate
          className={`text-5xl md:text-6xl font-light text-center text-gray-900 mb-16 transition-all duration-700 ${
            visibleElements.has('about-title')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          About the Artist
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div 
            id="about-text"
            data-animate
            className={`space-y-6 text-lg leading-relaxed text-gray-700 transition-all duration-700 ${
              visibleElements.has('about-text')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-8'
            }`}
          > 
            <p>
              My name is Joshua Otuonye, I am an African visual artist based in the United Kingdom. My artistic vision is to convey my unique perspectives and experiences through my creations.
            </p>
            
            <p>
              My visual artworks are characterized by their boundary-pushing nature, expressionof diverse viewpoints, and challenge to conventional norms. I embody these qualities and more.
            </p>

            <p>
              Born and raised in Nigeria, My creativity is boundless, and my artwork captivates and inspires those fortunate enough to encounter it.
            </p>

            <p>
              My ability to seamlessly blend various mediums and styles results in a dynamic and thought-provoking body of work. My meticulous attention to detail and knack for capturing the essence of the world around me enable my art to speak volumes and leave a lastung impression to the viewers
            </p>
          </div>
          
          <div 
            id="about-image"
            data-animate
            className={`transition-all duration-700 ${
              visibleElements.has('about-image')
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="flex items-center justify-center h-full">
              <Image
              src='/images/joshua.jpg'
              alt="the artist"
              width={500}
              height={400}
              className="aspect-[1/1] rounded-2xl object-cover h-full w-full"
            />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;