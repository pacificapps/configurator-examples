export default function colorMap(color: string, is3D = false) {
  switch (color) {
    case 'Blue':
      if (is3D) {
        return {
          hex: '#007FAB',
          label: 'Blue',
        };
      } else {
        return {
          hex: '#fff',
          label: 'White',
        };
      }

    case 'Red':
      return {
        hex: '#FF5448',
        label: 'Red',
      };

    default:
      return {
        hex: color,
        label: color,
      };
  }
}
