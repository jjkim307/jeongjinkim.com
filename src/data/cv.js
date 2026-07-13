import { publications } from './publications.js';

export const cvUpdated = 'July 13, 2026';

const p = (s) => s; // readability no-op for long strings

export const cvSections = [
  {
    id: 'appointment', en: 'Academic Appointment',
    items: [
      { label: '2025–', html: p('<strong>Assistant Professor</strong><br>Department of Psychology (Industrial-Organizational)<br>The University of Oklahoma (Norman, OK)<br>August 2025 – present') },
    ],
  },
  {
    id: 'education', en: 'Education',
    items: [
      { label: '2025', html: p('<strong>Ph.D. Industrial-Organizational Psychology</strong>, George Mason University<br>Dissertation committee: Reeshad S. Dalal, Ph.D. (Chair), Seth A. Kaplan, Ph.D., and Sarah M. Wittman, Ph.D.<br>Dissertation title: <i>Conditions under which the behavior of employees with attention-deficit/hyperactivity disorder is misperceived as low job performance</i>') },
      { label: '2022', html: p('<strong>M.A. Industrial-Organizational Psychology</strong> (concurrent degree with Ph.D.), George Mason University') },
      { label: '2019', html: p('<strong>M.A. Psychology</strong> (Industrial-Organizational Psychology emphasis), Yonsei University<br>Thesis committee: Young Woo Sohn, Ph.D. (Chair), Kwanghee Han, Ph.D., and Suran Lee, Ph.D.<br>Thesis title: <i>Examining when and why overqualified workers engage in extra-role behaviors: Testing a moderated mediation model</i>') },
      { label: '2016', html: p('<strong>B.A. Psychology</strong>, University of Wisconsin–Madison<br>Faculty advisor: Judy M. Harackiewicz, Ph.D.<br>Graduate student advisor: Cameron A. Hecht, Ph.D.<br>Thesis title: <i>Effects of utility-value intervention variations differ by student ethnicity and self-construal</i>') },
    ],
  },
  {
    id: 'interests', en: 'Research Interests',
    items: [
      { label: '', html: p('I am interested in the cognitive, affective, and social processes that shape individuals’ job performance and well-being in the workplace. My work generally falls into one or more of the following areas:<ul><li>Person–situation interactions, with a particular emphasis on situational factors (e.g., situational strength and content),</li><li>Job affect/emotion and attitudes such as job boredom and work engagement, and</li><li>Individual work performance behavior such as counterproductive work behavior and organizational citizenship behavior.</li></ul>') },
    ],
  },
  {
    id: 'pubs', en: 'Peer-Reviewed Publications',
    note: 'Boldface denotes my initials. Publications are listed by recency.',
    items: publications.map((pub, i) => ({
      label: `${publications.length - i}.`,
      html: pub.html
        + (pub.doi ? ` <a href="${pub.doi}" target="_blank" rel="noopener">${pub.doi.replace('https://', '').replace('http://', '')}</a>` : '')
        + (pub.note ? ` [${pub.note}]` : ''),
    })),
  },
  {
    id: 'underreview', en: 'Revise and Resubmit (R&R) or Under Review',
    items: [
      { label: '', html: p('Baines, J. I., Dalal, R. S., <strong>Kim, J. J.</strong>, Aitken, J. A., Kaplan, S. A., Zhu, Z., Hassani, J. (R2 under review). Research on remote work and counterproductive work behavior. <i>Human Performance</i>.') },
      { label: '', html: p('Ponce, L. P., <strong>Kim, J. J.</strong>, Kaplan, S. A., &amp; Fyffe, S. (R2 under review). Research on personality and measure-related techniques in experience-sampling methods. <i>International Journal of Social Research Methodology</i>.') },
      { label: '', html: p('Ponce, L. P., Kaplan, S. A., Dalal, R. S., <strong>Kim, J. J.</strong>, Moon, N. A., &amp; Aitken, J. A. (Invited for R&amp;R2). Research on personality and work engagement. <i>Journal of Business and Psychology</i>.') },
      { label: '', html: p('Son, M., <strong>Kim, J. J.</strong>, Dalal, R. S. Sohn, J., Nguyen, L. K., &amp; Maguire, L. (R1 under review). Research on situational strength and substance. <i>European Journal of Personality</i>.') },
    ],
  },
  {
    id: 'grants', en: 'Grants and Research Funding',
    items: [
      { label: '', html: p('<strong>Awarded External Funding</strong>') },
      { label: '2024', html: p('Fostering Neurodiverse Individuals’ Work Success via an Assistive Wearable Technology (Award #2326270), $1,871,692. Granter: National Science Foundation. PI: Vivian G. Motti; Co-PI: Sarah M. Wittman. Role: Graduate Research Assistant (January 2024 – May 2025).') },
      { label: '2021', html: p('Just-in-Time Adaptive Interventions for Emotion Regulation (Award #2052190), $400,000. Granter: National Science Foundation. PI: Reeshad S. Dalal; Co-PI: Seth A. Kaplan. Role: Graduate Research Assistant (June 2021 – August 2023).') },
      { label: '2018', html: p('Jang Hoon Research Grant, $1,060. Granter: Consumer Insight &amp; Invight (South Korea). Role: PI.') },
      { label: '', html: p('<strong>Awarded Internal Funding</strong>') },
      { label: '2025', html: p('Research on attention-deficit/hyperactivity disorder and job performance, $5,628. Granter: George Mason University I-O Graduate Student Fund. Role: PI.') },
      { label: '2023', html: p('CARMA workshop in Polynomial Regression and Response Surface Analysis [Attendee], $400. Granter: George Mason University I-O Graduate Student Fund.') },
      { label: '2021', html: p('Research on job boredom, $3,000. Granter: George Mason University I-O Graduate Student Fund. Role: PI.') },
      { label: '2021', html: p('CenterStat workshop in Multilevel Modeling [Attendee], $600. Granter: George Mason University I-O Graduate Student Fund.') },
    ],
  },
  {
    id: 'awards', en: 'Awards & Honors',
    items: [
      { label: '2025', html: p('SIOP Travel Award, Society for Industrial and Organizational Psychology, $500.') },
      { label: '2025', html: p('Graduate Student Travel Fund, Office of the Provost, George Mason University, $450.') },
      { label: '2024', html: p('Graduate Student Travel Fund, Department of Psychology, George Mason University, $829.') },
      { label: '2024', html: p('SIOP Travel Award, Society for Industrial and Organizational Psychology, $500.') },
      { label: '2024', html: p('Graduate Student Travel Fund, Office of the Provost, George Mason University, $450.') },
      { label: '2023', html: p('Graduate Student Travel Fund, Department of Psychology, George Mason University, $1,000.') },
      { label: '2023', html: p('Top 10 Poster Recognition at the Annual Conference of the Society for Industrial and Organizational Psychology. Poster entitled <i>Do tight cultures act as strong situations? A meta-analytic test</i>.') },
      { label: '2023', html: p('Graduate Student Travel Fund, Office of the Provost, George Mason University, $328.') },
      { label: '2022', html: p('Graduate Student Travel Fund, Department of Psychology, George Mason University, $750.') },
      { label: '2018', html: p('Travel Award for 2019 International Convention of Psychological Science, Association for Psychological Science, $500.') },
      { label: '2017', html: p('Graduate Student Research Fellowship, Brain Korea 21, Yonsei University, $1,590.') },
      { label: '2015–16', html: p('Dean’s List, College of Letters and Science, University of Wisconsin–Madison.') },
    ],
  },
  {
    id: 'presentations', en: 'Conference Presentations',
    note: 'Boldface denotes my initials. An asterisk denotes the presenter.',
    items: [
      { label: '29.', html: p('<strong>Kim, J. J.</strong>*, Son, M., Jang, H., &amp; Dalal, R. S. (2026, April 29–May 2). Apples and oranges? How ADHD behavior is confused with low job performance [Poster]. Society for Industrial and Organizational Psychology 2026 Conference, New Orleans, LA, USA.') },
      { label: '28.', html: p('Freire, J. (Co-Chair), Keegan, Q. (Co-Chair), Blocker, C., <strong>Kim, J. J.</strong>, Kuykendall, L. E., Sutphin, D. J., &amp; Vincent, C. (2026, April 29–May 2). Fake it ’til you... Wait, am I actually making it? A discussion on imposter syndrome [Panel]. Society for Industrial and Organizational Psychology 2026 Conference, New Orleans, LA, USA.') },
      { label: '27.', html: p('<strong>Kim, J. J.</strong>* (Co-Chair), Dalal, R. S. (Co-Chair), &amp; Green, J. P.* (Discussant). (2025, April 2–5). Decoding work situations: The nomological network of situational content and strength [Symposium]. Society for Industrial and Organizational Psychology 2025 Conference, Denver, CO, USA.') },
      { label: '26.', html: p('Son, M.*, <strong>Kim, J. J.</strong>, Sohn, J., Nguyen, L. K., Maguire, L., &amp; Dalal, R. S. (2025, April 2–5). Connecting the dots: Reviewing the current status of situational strength theory and its disconnection from situation content. In <strong>Kim, J. J.</strong> (Co-Chair), Dalal, R. S. (Co-Chair), &amp; Green, J. P. (Discussant), Decoding work situations: The nomological network of situational content and strength [Symposium]. Society for Industrial and Organizational Psychology 2025 Conference, Denver, CO, USA.') },
      { label: '25.', html: p('Kalantari, N., <strong>Kim, J. J.</strong>*, Wittman, S. M., &amp; Motti, V. G. (2025, April 2–5). Exploring neurodivergent individuals’ workplace challenges and strategies through AI-assisted analysis [Symposium]. In Ponce, L. P. (Co-Chair), Mintz, R. M. (Co-Chair), &amp; Wittman, S. (Co-Chair), Understanding neurodiversity in the workplace: Perceptions, intersectionality, and interventions. Society for Industrial and Organizational Psychology 2025 Conference, Denver, CO, USA.') },
      { label: '24.', html: p('Kalantari, N.*, <strong>Kim, J. J.</strong>, Wittman, S. M., &amp; Motti, V. G. (2024, May 30–31). Bridging human insight and AI: A comparative study of neurodivergent workplace experiences through large language models and manual coding [Paper]. Neurodiversity at Work Research Conference 2024, College Park, MD, USA.') },
      { label: '23.', html: p('Kalantari, N.*, <strong>Kim, J. J.</strong>, Wittman, S. M., &amp; Motti, V. G. (2024, May 30–31). Including neurodivergent voices through probing interviews: A methodological approach to enhance hiring practices [Paper]. Neurodiversity at Work Research Conference 2024, College Park, MD, USA.') },
      { label: '22.', html: p('<strong>Kim, J. J.</strong>*, &amp; Kaplan, S. A. (2024, April 17–20). Within-person changes in job boredom and counterproductive work behavior [Symposium]. In Bowling, N. A. (Co-Chair) &amp; Dye, K. (Co-Chair), Measurement, causes, and consequences of job boredom. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '21.', html: p('Park, J., Woo, S. E., &amp; <strong>Kim, J. J.</strong>* (2024, April 17–20). A multidimensional measure of attitudes towards artificial intelligence applications at work [Symposium]. In Samo, A. (Chair) &amp; Jayatilleke, B. (Discussant), Human-centered, ethical, and responsible artificial intelligence (HCER-AI) at work: Insights from psychological research. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '20.', html: p('<strong>Kim, J. J.</strong>*, Aitken, J. A., Baines, J. I., Zhu, Z., Hassani, J., Dalal, R. S., &amp; Kaplan, S. A. (2024, April 17–20). Good versus bad situational strength? Within-person effects on affect and performance [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '19.', html: p('Aitken, J. A.*, <strong>Kim, J. J.</strong>, Baines, J. I., Zhu, Z., Hassani, J., Dalal, R. S., &amp; Kaplan, S. A. (2024, April 17–20). A moral perspective on the self-regulation of counterproductive work behavior [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '18.', html: p('Aitken, J. A.*, Baines, J. I., Wonders, M. E., Kaplan, S. A., Clark, J. E., &amp; <strong>Kim, J. J.</strong> (2024, April 17–20). A meta-analysis of the within-person relationship between affect and job performance [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '17.', html: p('Zhu, Z.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Baines, J. I., Kaplan, S. A., Dalal, R. S., &amp; Hassani, J. (2024, April 17–20). Ecological momentary emotion regulation intervention in the workplace [Poster]. Society for Industrial and Organizational Psychology 2024 Conference, Chicago, IL, USA.') },
      { label: '16.', html: p('Kalantari, N.*, <strong>Kim, J. J.</strong>, Wittman, S. M., &amp; Motti, V. G. (2024, March 18–19). Including neurodivergent voices through probing interviews: A methodological approach to enhance hiring practices [Poster]. Access to Research and Inclusive Excellence 2024 National Conference, Fairfax, VA, USA.') },
      { label: '15.', html: p('Park, J., Woo, S. E., <strong>Kim, J. J.</strong>, &amp; Kim, S.* (2023, August 17–19). Attitudes toward artificial intelligence application at work: Scale development and validation [Symposium]. Korean Society for Industrial and Organizational Psychology 2023 Conference, Suwon, South Korea.') },
      { label: '14.', html: p('<strong>Kim, J. J.</strong>*, Son, M., Baines, J. I., Bui, T. N., Tsai, H.-C., Aranda, N., Dalal, R. S., &amp; Kaplan, S. A. (2023, April 19–22). Do tight cultures act as strong situations? A meta-analytic test [Poster; Top 10 Award]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '13.', html: p('<strong>Kim, J. J.</strong>*, Ponce, L. P., Aitken, J. A., Farrar, S., &amp; Kaplan, S. (2023, April 19–22). Within-person dynamics of workplace boredom and its coping mechanisms [Poster]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '12.', html: p('Aitken, J. A.*, <strong>Kim, J. J.</strong>, Ponce, L. P., Farrar, S., Kaplan, S., &amp; Merlo, K. (2023, April 19–22). Delineating the performance consequences of affective states versus emotion episodes [Poster]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '11.', html: p('Ponce, L. P.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Farrar, S., &amp; Kaplan, S. A. (2023, April 19–22). The incremental advantage of personality facets in predicting state work engagement [Poster]. Society for Industrial and Organizational Psychology 2023 Conference, Boston, MA, USA.') },
      { label: '10.', html: p('Ponce, L. P.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Kim, H., Farrar, S., &amp; Kaplan, S. A. (2022, August 4–6). Who will make the cut? Comparing scale shortening techniques [Poster]. American Psychological Association 2022 Convention, Minneapolis, MN, USA.') },
      { label: '9.', html: p('Aitken, J. A., Baines, J. I.*, <strong>Kim, J. J.</strong>, Zhu, Z., Hassani, J., Kaplan, S. A., Dalal, R. S., Gibson, J. L., &amp; Merlo, K. L. (2022, May 26–29). Just-in-time adaptive interventions for cognitive reappraisal: Improvements in workplace affect [Poster]. Association for Psychological Science 2022 Convention, Chicago, IL, USA.') },
      { label: '8.', html: p('Baines, J. I.*, Aitken, J. A., <strong>Kim, J. J.</strong>, Hassani, J., Zhu, Z., Kaplan, S. A., &amp; Dalal, R. S. (2022, May 26–29). The relationship between telework and counterproductive work behavior [Poster]. Association for Psychological Science 2022 Convention, Chicago, IL, USA.') },
      { label: '7.', html: p('Hecht, C. A.*, <strong>Kim, J. J.</strong>, Harackiewicz, J. M. (2021, February 9–13). What’s good for you is good for me: The role of other-oriented utility value in interdependent students’ interest development [Poster]. Society for Personality and Social Psychology 2021 Convention (virtual).') },
      { label: '6.', html: p('<strong>Kim, J. J.</strong>*, Lim, J. I., &amp; Sohn, Y. W. (2019, March 7–9). Perceived overqualification, job boredom, and counterproductive work behavior: A moderating role of meaning in life [Poster]. International Convention of Psychological Science 2019 Convention, Paris, France.') },
      { label: '5.', html: p('<strong>Kim, J. J.</strong>*, Park, S. Y., Koo, R. H., &amp; Sohn, Y. W. (2018, May 24–27). The relations of work identity with job satisfaction and life satisfaction: A moderating role of family identity [Poster]. Association for Psychological Science 2018 Convention, San Francisco, CA, USA.') },
      { label: '4.', html: p('<strong>Kim, J. J.</strong>*, Min, J. H., Piao, M., &amp; Sohn, Y. W. (2018, May 19). The relationship between occupational self-efficacy and organizational citizenship behavior: A moderating role of perceived overqualification [Poster]. Korean Society for Industrial and Organizational Psychology 2018 Spring Conference, Cheonan, South Korea.') },
      { label: '3.', html: p('Shin, S. M., Song, Y. S.*, <strong>Kim, J. J.</strong>, &amp; Kim, T. J. (2017, August 3–6). The relationship between smartphone addiction and impulsiveness: Focused on delay discounting [Poster]. American Psychological Association 2017 Convention, Washington, DC, USA.') },
      { label: '2.', html: p('Hecht, C. A.*, <strong>Kim, J. J.</strong>, Tibbetts, Y., &amp; Harackiewicz, J. M. (2017, April 27–May 1). Finding value for the self versus close others: Implications for culturally-tailored utility-value interventions [Symposium]. In the Developments in Expectancy Value Intervention Research symposium, American Educational Research Association 2017 Convention, San Antonio, TX, USA.') },
      { label: '1.', html: p('Hecht, C. A.*, <strong>Kim, J. J.</strong>, Tibbetts, Y., &amp; Harackiewicz, J. M. (2017, January 19–21). Finding value for the self versus close others: Implications for culturally-tailored utility-value interventions [Poster]. Society for Personality and Social Psychology 2017 Convention, San Antonio, TX, USA.') },
    ],
  },
  {
    id: 'teaching', en: 'Teaching Experience',
    items: [
      { label: '', html: p('<strong>The University of Oklahoma</strong>') },
      { label: 'Spring 2026', html: p('Introduction to Industrial-Organizational Psychology (PSY 3753-996) — Instructor') },
      { label: 'Fall 2025', html: p('Understanding Statistics (PSY 2003-001) — Instructor') },
      { label: 'Fall 2025', html: p('Introduction to Industrial-Organizational Psychology (PSY 3753-001) — Instructor') },
      { label: '', html: p('<strong>George Mason University</strong>') },
      { label: 'Fall 2023', html: p('General Linear Modeling I (PSYC 642) — Lab Teaching Assistant') },
      { label: 'Spring 2023', html: p('Research Methods in Psychology (PSYC 301) — Lab Teaching Assistant') },
      { label: 'Summer 2022', html: p('Organizational Behavior (MGMT 313) — Teaching Assistant') },
      { label: 'Spring 2021', html: p('Statistics in Psychology (PSYC 300) — Lab Teaching Assistant') },
      { label: 'Fall 2020', html: p('Statistics in Psychology (PSYC 300) — Lab Teaching Assistant') },
      { label: '', html: p('<strong>Yonsei University</strong>') },
      { label: 'Spring 2019', html: p('Understanding on Cinema (UCL1105) — Teaching Assistant') },
      { label: 'Spring 2018', html: p('Modern Society and Psychological Health (UCL1205) — Teaching Assistant') },
      { label: 'Winter 2017', html: p('Psychology of Talent and Skill (PSY4141) — Teaching Assistant') },
      { label: 'Fall 2017', html: p('Science of Stress &amp; Adaptive Life (YCE1607) — Teaching Assistant') },
      { label: 'Spring 2017', html: p('Psychology of Language: Theories &amp; Practice (PSY3125) — Teaching Assistant') },
    ],
  },
  {
    id: 'service', en: 'Institutional and Professional Service',
    items: [
      { label: '2025–', html: p('Diversity, Equity, and Inclusion (Helen Riddle Award) Committee, The University of Oklahoma (Aug. 2025 – present)') },
      { label: '2025–', html: p('Social Media and Web Committee, The University of Oklahoma (Aug. 2025 – present)') },
      { label: '2023–25', html: p('Conference Reviewer, Annual Conference for the Society for Industrial and Organizational Psychology (SIOP)') },
      { label: '2022–23', html: p('Assistant Editor, <i>Journal of Business and Psychology</i> (Dec. 2022 – Dec. 2023)') },
      { label: '2021–22', html: p('Vice President, Industrial-Organizational Psychology Student Association (IOPSA), George Mason University (Aug. 2021 – July 2022)') },
      { label: '2021–25', html: p('Research Coordinator for the Undergraduate Subject Pool (SONA), Department of Psychology, George Mason University (May 2021 – May 2025)') },
      { label: '2018–19', html: p('Research Coordinator for the Undergraduate Subject Pool (SONA), Department of Psychology, Yonsei University (Mar. 2018 – Mar. 2019)') },
    ],
  },
  {
    id: 'affiliations', en: 'Professional Affiliations',
    items: [
      { label: '2025–', html: p('Member, Society for Industrial and Organizational Psychology (SIOP)') },
      { label: '2025–', html: p('Member, Data Institute for Societal Challenges, The University of Oklahoma') },
      { label: '2025–', html: p('Affiliate, Institute for Community and Society Transformation, The University of Oklahoma') },
      { label: '2023–', html: p('Student Member, Academy of Management') },
      { label: '2020–25', html: p('Student Affiliate, Society for Industrial and Organizational Psychology') },
    ],
  },
  {
    id: 'media', en: 'Media Coverage',
    items: [
      { label: '2019', html: p('Association for Psychological Science. (2019, July 10). Dedication buffers employees against boredom, study suggests.') },
    ],
  },
];
