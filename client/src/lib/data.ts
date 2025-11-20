
import poster1 from '@assets/generated_images/acid_graphics_poster_1.png';
import poster2 from '@assets/generated_images/acid_graphics_poster_2.png';
import poster3 from '@assets/generated_images/acid_graphics_poster_3.png';
import userRef from '@assets/image_1763675755958.png';

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  size: 'small' | 'medium' | 'large';
}

// DATA SOURCE:
// Since you are planning to move to WordPress, this array acts as your placeholder database.
// You can simply add new objects to this array to populate the grid.
export const projects: Project[] = [
  {
    id: '01',
    title: 'NEON GENESIS',
    category: 'Art Direction',
    image: poster1,
    year: '2024',
    size: 'large',
  },
  {
    id: '02',
    title: 'RED SHIFT',
    category: 'Typography',
    image: poster2,
    year: '2023',
    size: 'medium',
  },
  {
    id: '03',
    title: 'CHROME LIQUID',
    category: '3D Motion',
    image: poster3,
    year: '2024',
    size: 'medium',
  },
  {
    id: '04',
    title: 'ARCHIVE V1',
    category: 'Curation',
    image: userRef,
    year: '2022',
    size: 'large',
  },
];
