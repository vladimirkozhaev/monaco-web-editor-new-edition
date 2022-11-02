import {  ExpressionResult, calcFormatted } from '../lang-util/FormatterVisitor';


 describe('Test of the language equations', () => {
  it('return a number', async () => {
    expect((await calcFormatted('1')).value).toEqual('1');
  });

  it('add test ', async () => {
    expect((await calcFormatted('1     +    1')).value).toEqual('1 + 1');
  });

  it('mul or div test ', async () => {
    expect((await calcFormatted('1     *    1')).value).toEqual('1 * 1');
  });

  it('brackets test ', async () => {
    expect((await calcFormatted('(1     *    1)')).value).toEqual('( 1 * 1 )');
  });

  it('and test ', async () => {
    expect((await calcFormatted('(1     &&    1)')).value).toEqual('( 1 && 1 )');
  });
  
  it('or test ', async () => {
    expect((await calcFormatted('(1     ||    1)')).value).toEqual('( 1 || 1 )');
  });

  it('date test ', async () => {
    expect((await calcFormatted('new Date(2014,    8, 1,        10,    19,    50)')).value).toEqual('new Date(2014, 8, 1, 10, 19, 50)');
  });


  it('diff in minutes test ', async () => {
    expect((await calcFormatted('  differenceInMinutes(new Date(1999   ,  9 ),new Date(   1999   ,  10  )')).value)
    .toEqual('differenceInMinutes(new Date(1999, 9), new Date(1999, 10))');
  });

  it('diff in hours test ', async () => {
    expect((await calcFormatted('  differenceInHours(new Date(1999   ,  9 ),new Date(   1999   ,  10  )')).value)
    .toEqual('differenceInHours(new Date(1999, 9), new Date(1999, 10))');
  });

  

  it('diff in days test ', async () => {
    expect((await calcFormatted('  differenceInDays(new Date(1999   ,  9 ),new Date(   1999   ,  10  )')).value)
    .toEqual('differenceInDays(new Date(1999, 9), new Date(1999, 10))');
  });

  it('power test ', async () => {
    expect((await calcFormatted('power  (2  ,2     )')).value)
    .toEqual('power(2, 2)');
  });
 

  it('identity test ', async () => {
    expect((await calcFormatted('1 ===                   2')).value)
    .toEqual('1 === 2');
  });

 
//  it('date add test ', async () => {
//
//    let str:string=await calcFormatted(' dateAdd(new Date(    2014, 8, 1, 10,        19, 50), {' +
//    'years: 2,' +
//    'months: 9,' +
//    'weeks: 1,' +
//    'days: 7,' +
//    'hours: 5,' +
//    'minutes: 9,' +
//    'seconds: 30' +
//    '})').value
//   
//    expect(str)
//    .toEqual(`dateAdd( new Date(2014, 8, 1, 10, 19, 50) , {\n\tyears:2,\n\tmonths:9,\n\tweeks:1,\n\tdays:7,\n\thours:5,\n\tminutes:9,\n\tseconds:30\n\t} )`);
//    
//  });

  

//  it('date sub test ', async () => {
//
//    let str:string=await calcFormatted(`dateSubtract(new Date(2014, 8, 1, 10, 19, 50), {
//      years: 2,
//      months: 9,
//      weeks: 1,
//      days: 7,
//      hours: 5,
//      minutes: 9,
//      seconds: 30
//    });`).value
//    console.log("str --------------------------")
//    console.log(str)
//    expect(str)
//    .toEqual(`dateSubtract( new Date(2014, 8, 1, 10, 19, 50) , {\n\tyears :2,\n\tmonths :9,\n\tweeks :1,\n\tdays :7,\n\thours :5,\n\tminutes :9,\n\tseconds :30\n\t} )`);
//    
//  });
});
