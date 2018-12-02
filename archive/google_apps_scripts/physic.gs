/** @OnlyCurrentDoc */

function Obliczeniafizyczne() {
  const config = {
    equationRange: "D1",
    dataRange: "C5:D50",
    calculationsRange: "H5:L50",
    resultsRange: "P5:V5",
    resultsEquationsRange: "R9:R10"
  }
  const sheet = SpreadsheetApp.getActiveSheet()
  
  clearRanges( sheet, [
    config.dataRange,
    config.calculationsRange,
    config.resultsRange,
    config.resultsEquationsRange
  ] )
  
  var equationCell = sheet.getRange( config.equationRange )
  var equationData = equationCell.getValue().match( /(\d)x *(.) *= *(.*)/ )
  
  if (!equationData)
    return
    
  const equation = {
    cell: equationCell,
    value: equationData[3],
    symbol: equationData[2],
    quantity: equationData[1],
    elements: equationData[3].match( /[a-z]\d?\$?(?:\^\([\/\-0-9]*\))?/gi ),
    variables: {}
  }
  
  var dataAreaFirstCell = sheet.getRange( config.dataRange ).getCell( 1, 1 )
  var row = dataAreaFirstCell.getRow()
  var column = dataAreaFirstCell.getColumn()
  for (var index in equation.elements) {
    var fullElement = equation.elements[index].match( /^([a-z]\d?)(\$)?(?:\^(.*))?$/i )
    var element = fullElement[1]
    var power = fullElement[3] || 1
    var mutable = !!fullElement[2]

    var v = equation.variables[element] = {
      power: eval( power ),
      delta: null,
      values: [],
      mutable: mutable
    }
    
    for (var i = 0;  i < (mutable ? equation.quantity : 1);  i++, row++)
      v.values.push( createDataField( sheet, row, column, element + (i + 1) + " =" ).getA1Notation() )
    
    v.delta = createDataField( sheet, row, column, "Δ" + element + " =" ).getA1Notation()
    row += 2
  }
  
  equation.value = equation.value.replace( /(?:[a-z]\d?|\d+)\$?(?:\^\(.*?\))?/gi, function( matched ) {
    const split = matched.split( /\$(?:\^\()|\$|(?:\^\()|\)/ )
    var basic = split[0]
    var power = split[1]

    if (power)
      return "Math.pow( " + (isNaN( basic ) ? "$" : "") + basic + ", " + power + " )"
    else
      return isNaN( basic ) ? "$" + basic : basic
  } )
  
  PropertiesService.getScriptProperties().setProperty( 'equation', JSON.stringify( equation ) )
  PropertiesService.getScriptProperties().setProperty( 'config', JSON.stringify( config ) )
  onEdit()
}

function onEdit( e ) {
  const equation = JSON.parse( PropertiesService.getScriptProperties().getProperty( "equation" ) )
  const config = JSON.parse( PropertiesService.getScriptProperties().getProperty( "config" ) )
  const sheet = SpreadsheetApp.getActiveSheet()
  
  var vars = equation.variables

  if (!config || !valuesWrited( sheet, vars ))
    return
  
  var equationFormula = equation.value
  var quantity = +equation.quantity
  var symbol = equation.symbol
  var relativeErr = 0
  
  var n, m
  
  n = sheet.getRange( config.calculationsRange )
  var calculations_FirstCell = { row:n.getRow(), column:n.getColumn() }
  
  n = sheet.getRange( config.resultsRange )
  var resultsRange_FirstCell = { row:n.getRow(), column:n.getColumn() }
  
  n = sheet.getRange( config.resultsEquationsRange )
  var resultsEquations_FirstCell = { row:n.getRow(), column:n.getColumn() }
  
  // sheet.getRange( "R4" ).setValue( equationFormula )
  
  for (var variableName in vars) {
    var variable = vars[variableName]
    
    if (variable.mutable)
      continue
      
    equationFormula = equationFormula.replace( new RegExp( "\\$" + variableName, "g" ), variable.values[0] )
    relativeErr += variable.power * Math.pow( variable.delta / variable.values[0], 2 )
  }
  
  // sheet.getRange( "R5" ).setValue( equationFormula )
  
  m = calculations_FirstCell
  for (var i = 0;  i < quantity;  i++) {
    var formula = equationFormula
    var relErr = relativeErr
    var relErrFormula = ""
    n = 0
    
    for (var variableName in vars) {
      var variable = vars[variableName]

      if (!variable.mutable)
        continue

      formula = formula.replace( new RegExp( "\\$" + variableName, "g" ), variable.values[i] )
      relErr += variable.power * Math.pow( variable.delta / variable.values[i], 2 )
      relErrFormula += (n++ ? " + " : "") + variable.power + " * (" + variable.delta + " / " + variable.values[i] + ")"
    }
    
    var value = eval( formula )
    var relErr = Math.sqrt( relErr )
    sheet.getRange( m.row + i, m.column + 0 ).setValue( /*      symbol + i + " = " + */value )
    sheet.getRange( m.row + i, m.column + 2 ).setValue( /*"δ" + symbol + i + " = " + */relErr )
    sheet.getRange( m.row + i, m.column + 4 ).setValue( /*"Δ" + symbol + i + " = " + */value * relErr )
    
    sheet.getRange( m.row + i + quantity + 1,     m.column ).setValue(       symbol + i + " = " + formula )
    sheet.getRange( m.row + i + quantity * 2 + 2, m.column ).setValue( "δ" + symbol + i + " = sqrt( " + relErrFormula + " )" )
  }
  
  m = resultsRange_FirstCell

  /* * *
   * Average */
  var averageFirstCellRow  = 5 + 1 + quantity
  var average = 0
  
  var averageParts = sheet.getRange( 5, 8, quantity ).getValues()
  var X = 0
  for (var i in averageParts)
    average += +averageParts[i]
    
  average /= quantity
  sheet.getRange( m.row, m.column ).setValue( average )
  
  
  /* * *
   * Standard deviation */
  var standardDeviation = 0
  var standardDeviation_formula = ""
  n = 0 
  for (var i in averageParts) {
    standardDeviation += Math.pow( average - +averageParts[i], 2 )
    standardDeviation_formula += (n++ ? " + (" : "(") + round( average, 3 ) + " - " + round( +averageParts[i], 3 ) + ")^2"
  }

  standardDeviation = Math.sqrt( standardDeviation / (quantity * (quantity - 1)) )
  sheet.getRange( m.row, m.column + 2 ).setValue( standardDeviation )
  sheet.getRange( resultsEquations_FirstCell.row, resultsEquations_FirstCell.column ).setValue( 
    "sqrt( " + standardDeviation_formula + " ) / (" + quantity + " * " + (quantity - 1)
  )

  n = 1
  while (standardDeviation * n < 1)
    n *= 10

  var significantNumbers = Math.ceil( standardDeviation * n ) / n
  sheet.getRange( m.row, m.column + 4 ).setValue( (significantNumbers - standardDeviation) / standardDeviation * 100 )
  sheet.getRange( resultsEquations_FirstCell.row + 1, resultsEquations_FirstCell.column ).setValue(
    "(" + significantNumbers + " - " + standardDeviation + ") / " + standardDeviation + " * 100%"
  )
  
  
  /* * *
   * Result */
  //n = 0
  //var absoluteErrors = sheet.getRange( 5, 12, quantity ).getValues()
  //for (var i in absoluteErrors)
  //  if (+absoluteErrors[i] > n)
  //    n = absoluteErrors[i]
  //
  //sheet.getRange( "V5" ).setValue( n )
  
  n = significantNumbers < 10 ? 1 : 2
  sheet.getRange( m.row, m.column + 6 ).setValue( round( average, n ) + " ± " + round( standardDeviation, n ) )
  
  
}




/* * *
 * Helpers below */



function valuesWrited( sheet, variables ) {
  for (var variableName in variables) {
    var v = variables[variableName]
    
    var delta = +sheet.getRange( v.delta ).getValue()
    
    if (!delta || isNaN( delta ))
      return false
      
    v.delta = delta
    
    for (var index in v.values) {   
      var rangeVal = +sheet.getRange( v.values[index] ).getValue()
      
      if (!rangeVal || isNaN( rangeVal ))
        return false
        
      v.values[index] = rangeVal
    }
  }
  
  return true
}

function round( number, precision ) {
  precision = Math.pow( 10, precision )
  return Math.floor( number * precision ) / precision
}


function createDataField( sheet, row, column, fieldName ) {
  const label = sheet.getRange( row, column )
  const data = sheet.getRange( row, column + 1 )
  
  formatCell( label.setValue( fieldName ), "label" )
  formatCell( data, "data" )
  
  return data
}

function formatCell( range, type ) {
  switch (type) {
    case "title":
      range
      .setHorizontalAlignment( "center" )
      .setBackground( "#f3f3f3" )
      .setFontWeight( "bold" )
      break
    break
    case "label":
      range
      .setHorizontalAlignment( "right" )
      .setBackground( "#f3f3f3" )
      .setFontWeight( "bold" )
      break
    case "data":
      range
      .setHorizontalAlignment( "left" )
      .setBackground( null )
      break
  }
}

function clearRanges( sheet, ranges ) {
  for (var index in ranges)
    sheet.getRange( ranges[index] ).clear()
}