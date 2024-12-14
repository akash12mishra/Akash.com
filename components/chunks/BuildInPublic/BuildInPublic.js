import React from "react";
import styles from "./BuildInPublic.module.scss";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Jack Smith",
    handle: "@jacksmith",
    content:
      "The dating profile photos I received transformed my online presence and boosted my matches significantly. Truly a game changer!",
    image: "/.",
    link: "https://twitter.com/demo1",
  },
  {
    id: 2,
    name: "Jill Smith",
    handle: "@jillsmith",
    content:
      "I was completely blown away by the results. This service exceeded all my expectations. Absolutely amazing!",
    image: "/.",
    link: "https://twitter.com/demo2",
  },
  {
    id: 3,
    name: "John Doe",
    handle: "@johndoe",
    content:
      "Using Photo AI for my LinkedIn profile was a fantastic decision. The quality was outstanding, and I got multiple job offers!",
    image: "/.",
    link: "https://twitter.com/demo3",
  },
  // Duplicated for continuous scroll
];

const bottomTestimonials = [
  {
    id: 4,
    name: "Jane Doe",
    handle: "@janedoe",
    content:
      "Words can't express how thrilled I am with the results. This service is simply phenomenal. I love it!",
    image: "/.",
    link: "https://twitter.com/demo4",
  },
  {
    id: 5,
    name: "Jenny Mandell",
    handle: "@jennymandell",
    content:
      "I can't find the words to describe how impressed I am. This service is truly remarkable. I love it!",
    image: "/.",
    link: "https://twitter.com/demo5",
  },
  {
    id: 6,
    name: "James Cameron",
    handle: "@jamescameron",
    content:
      "I am genuinely amazed by the quality of the photos. This service is a game changer for anyone looking to enhance their profile!",
    image: "/.",
    link: "https://twitter.com/demo6",
  },
  // Duplicated for continuous scroll
];

const BuildInPublic = () => {
  return (
    <div className={styles.BuildInPublic}>
      <div className={styles.testimonialHeader}>
        <span className={styles.label}>TESTIMONIALS</span>
        <h2 className={styles.title}>What Our Users Say</h2>
        <p className={styles.subtitle}>
          Discover why thousands are choosing Pictoria AI for effortless,
          high-quality photo generation, from LinkedIn headshots to vibrant
          social media content.
        </p>
      </div>

      <div className={styles.cardsContainer}>
        <div className={styles.gradientLeft}></div>
        <div className={styles.gradientRight}></div>

        <div className={styles.scrollContainer}>
          <div className={styles.row}>
            {[...testimonials, ...testimonials].map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
              >
                <div className={styles.content}>
                  <p>{item.content}</p>
                  <div className={styles.userInfo}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                    <div className={styles.userText}>
                      <h4>{item.name}</h4>
                      <span>{item.handle}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className={`${styles.row} ${styles.reverse}`}>
            {[...bottomTestimonials, ...bottomTestimonials].map(
              (item, index) => (
                <a
                  key={`${item.id}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  <div className={styles.content}>
                    <p>{item.content}</p>
                    <div className={styles.userInfo}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className={styles.avatar}
                      />
                      <div className={styles.userText}>
                        <h4>{item.name}</h4>
                        <span>{item.handle}</span>
                      </div>
                    </div>
                  </div>
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildInPublic;
