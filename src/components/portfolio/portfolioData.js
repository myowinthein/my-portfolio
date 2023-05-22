import studymeImg1 from "../../../public/assets/portfolio/studyme/1.png";
import studymeImg2 from "../../../public/assets/portfolio/studyme/2.png";
import studymeImg3 from "../../../public/assets/portfolio/studyme/3.png";
import studymeImg4 from "../../../public/assets/portfolio/studyme/4.png";

const PortfolioData = [
  {
    'title': 'Education',
    'projects': [
      {
        'name': 'StudyMe',
        'description': `
          StudyMe works by facilitating matches and meaningful conversations between prospective students and
          universities. The platform is student-centred, built so that students can be discovered by the best
          universities in the world. Over 60,000 students from 204 countries are using StudyMe at the moment.
        `,
        'languages': 'Laravel, PostgreSQL, React, Docker, AWS',
        'thumbnail': studymeImg1,
        'media': [
          {'type': 'video', 'url': '/assets/portfolio/studyme/Be Discovered on StudyMe.mp4'},
          {'type': 'image', 'url': studymeImg1},
          {'type': 'image', 'url': studymeImg2},
          {'type': 'image', 'url': studymeImg3},
          {'type': 'image', 'url': studymeImg4},
        ],
        'platforms': {
          'web': 'https://www.studyme.com',
          'android': 'https://play.google.com/store/apps/details?id=com.studyme',
          'ios': 'https://apps.apple.com/us/app/studyme/id1556187658'
        },
        'award': ''
      }
    ]
  }
]

export default PortfolioData;