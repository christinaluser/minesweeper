import zero from './Assets/zero.png';
import one from './Assets/1.png';
import two from './Assets/2.png';
import three from './Assets/3.png';
import four from './Assets/4.png';
import five from './Assets/5.png';
import six from './Assets/6.png';
import seven from './Assets/7.png';
import eight from './Assets/8.png';

export function randomInt(min, max) {
  [min,max] = [Math.ceil(min), Math.floor(max)]
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function digitToImg(digit) {
  const words = [ zero, one, two, three, four, five, six, seven, eight ];
  return words[digit];
}

export default [ randomInt, digitToImg ];