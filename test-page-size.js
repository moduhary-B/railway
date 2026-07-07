// Тест для проверки правильности расчета размера страниц
const testPageSizeCalculation = () => {
  const getPageSize = (country) => {
    switch (country) {
      case 'japan': return 60;
      case 'korea': return 24;
      case 'china': return 20;
      default: return 24;
    }
  };

  const testCases = [
    { country: 'japan', totalCars: 120, expectedPages: 2 },
    { country: 'japan', totalCars: 60, expectedPages: 1 },
    { country: 'japan', totalCars: 61, expectedPages: 2 },
    { country: 'korea', totalCars: 48, expectedPages: 2 },
    { country: 'korea', totalCars: 24, expectedPages: 1 },
    { country: 'korea', totalCars: 25, expectedPages: 2 },
    { country: 'china', totalCars: 40, expectedPages: 2 },
    { country: 'china', totalCars: 20, expectedPages: 1 },
    { country: 'china', totalCars: 21, expectedPages: 2 },
  ];

  console.log('=== ТЕСТ РАЗМЕРА СТРАНИЦ ===');
  
  testCases.forEach(({ country, totalCars, expectedPages }) => {
    const pageSize = getPageSize(country);
    const calculatedPages = Math.ceil(totalCars / pageSize);
    const status = calculatedPages === expectedPages ? '✅' : '❌';
    
    console.log(`${status} ${country.toUpperCase()}: ${totalCars} машин / ${pageSize} на страницу = ${calculatedPages} страниц (ожидалось: ${expectedPages})`);
  });
};

testPageSizeCalculation();
