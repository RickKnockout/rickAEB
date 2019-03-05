// ==UserScript==
// @name           AE BCalc
// @namespace      astroempires.com
// @description    AEBCalc
// @include        http*://*.astroempires.com/combat.aspx*
// ==/UserScript==
//totalStart = new Date();

// armor/power/sheild of all units
var shipDefaultArmour = new Array(2,2,4,4,4,2,8,12,12,2,4,24,24,48,128,96,512,2048,6600,13500,4,8,16,24,32,64,256,512,2048,1024);
var shipDefaultPower = new Array(2,4,10,12,4,2,8,12,14,1,2,24,12,48,168,64,756,3402,10000,25500,4,8,16,24,32,64,256,2,4,2048);
var shipDefaultShield = new Array(0,0,0,1,0,0,0,0,1,0,0,2,2,4,10,8,20,30,40,60,0,0,0,0,2,6,8,16,20,12);

var FT_INDEX = 0;var BO_INDEX = 1;var HB_INDEX = 2;var IB_INDEX = 3;var CV_INDEX = 4;var RC_INDEX = 5;var DE_INDEX = 6;var FR_INDEX = 7;var IF_INDEX = 8;var SS_INDEX = 9;var OS_INDEX = 10;var CR_INDEX = 11;var CA_INDEX = 12;var HC_INDEX = 13;var BC_INDEX = 14;var FC_INDEX = 15;var DN_INDEX = 16;var TI_INDEX = 17;var LE_INDEX = 18;var DS_INDEX = 19;var BARRACKS_INDEX = 20;var LASER_TURRETS_INDEX = 21;var MISSLE_TURRETS_INDEX = 22;var PLASMA_TURRENTS_INDEX = 23;var ION_TURRETS_INDEX = 24;var PHOTON_TURRETS_INDEX = 25;var DISRUPTOR_TURRETS_INDEX = 26;var DEFLECTION_SHIELDS_INDEX = 27;var PLANETARY_SHIELD_INDEX = 28;var PLANETARY_RING_INDEX = 29;

//Tech in order, Laser, Missile, Plasma, Ion, Photon, Disruptor, Armour, Shielding
var shipWeaponTechIndex = new Array(0,1,2,3,0,0,2,1,3,0,0,2,1,2,3,3,4,5,4,5,0,0,1,2,3,4,5,3,3,4);
// cost of ships
var shipValues = new Array(5,10,30,60,20,30,40,80,120,40,100,200,400,500,2000,2500,10000,50000,200000,500000);
// originaly from here
// http://userscripts.org/scripts/show/39043
// Copyright (C) 2008  dave@mindkeep.org

var NAME_INDEX = 0;
var START_QUANT_INDEX = 1;
var END_QUANT_INDEX = 2;
var POWER_INDEX = 3;
var ARMOR_INDEX = 4;
var SHIELD_INDEX = 5;

var DEBUG_OFF = 0;
var DEBUG_TIMING = 1;
var DEBUG_VERBOSE = 2;
var bc_debug_level = DEBUG_TIMING;

//Tech in order, Laser, Missile, Plasma, Ion, Photon, Disruptor, Armour, Shielding
var attackerTech = new Array(0,0,0,0,0,0,0,0);
var defenderTech = new Array(0,0,0,0,0,0,0,0);

////debug('in battle calc');
// runBattleCalc(), calls estimateLosses,initEndQuants,attackOneWay,roundEndQuants
// estimateLosses(), calls insertTechInformation
// insertTechInformation() , called by estimateLosses
// initEndQuants() called by runBattleCalc
// attackOneWay() called by runBattleCalc, massive
// roundEndQuants() called by runBattleCalc, calls roundUp,roundEndQuants
// roundUp() called by roundEndQuants
// findScale() called by roundEndQuants
// calcDamagePerUnit(power, shield, over
// isConfirmPage() , not needed?

function isConfirmPage() {
	var temp = false;
	var confirmTitle = document.evaluate("//b[text() ='Confirm Attack']",document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
	//console.log(confirmTitle.snapshotItem(0));
	if (confirmTitle.snapshotLength >= 1) {
		temp = true;
	}
	//console.log("isConfirmPage() returned "+temp+", complete.");
	return temp;
}
function calcDamagePerUnit(power, shield, over) {
	var damagePerUnit = 0;
	if (power > shield) damagePerUnit = (power - shield) + (shield * over);
	else damagePerUnit = (power * over);
	//console.log("calcDamagePerUnit("+power+", "+shield+", "+over+") returned "+damagePerUnit+", complete.");
	return damagePerUnit;
}
function calcDamagePerUnitNew(power, shield, bleed, nobleed){
	var damagePerUnit = 0;
	if (shield === 0){
		damagePerUnit = power
	}else{
		if (shield < power) {
		damagePerUnit = power - shield * nobleed;
	}
	else {damagePerUnit = power * bleed;}}
  return damagePerUnit
}
function calculateDamagePerUnitFactor(power, shield, bleed, nobleed) {
	var factor = 0.85

	if (shield === 0){
		damagePerUnit = power
	}else{
		if (shield < power) {
		damagePerUnit = power - shield * nobleed;
	}
	else {damagePerUnit = power * bleed;}}
	return Math.pow(damagePerUnit,factor)
}

function findScale(name)
{
    var scale;

    if (name == "Fighters" ||
            name == "Bombers" ||
            name == "Heavy Bombers" ||
            name == "Ion Bombers" ||
            name == "Corvette" ||
            name == "Recycler" ||
            name == "Destroyer" ||
            name == "Frigate" ||
            name == "Ion Frigate" ||
            name == "Scout Ship" ||
            name == "Outpost Ship")
    {
        scale = 0;
    }
    else if (name == "Cruiser" ||
            name == "Carrier" ||
            name == "Heavy Cruiser")
    {
        scale = 1;
    }
    else
    {
        scale = 2;
    }

    //console.log("findScale("+name+") returned "+scale+", complete.");
    return scale;
}
function roundUp(value, scale)
{
	// HC: d = Math.floor(Math.round(10 * d) / 10);
	// DN++ d = Math.floor(Math.round(100 * d) / 10);

    var mult = Math.pow(10,scale);
    var rounded = Math.floor(Math.round(value*mult) / mult);
    //console.log("roundUp("+value+", "+scale+") returned "+rounded+", complete.");
    return rounded;
}
function roundEndQuants(rows)
{
    for (var i = 0; i < rows.snapshotLength; i++)
    {
        var row = rows.snapshotItem(i);
        var scale = findScale(row.childNodes[NAME_INDEX].firstChild.nodeValue);
        var roundedValue = roundUp(parseFloat(row.childNodes[END_QUANT_INDEX].firstChild.textContent), scale);
        row.childNodes[END_QUANT_INDEX].firstChild.textContent = roundedValue;

        if (row.childNodes[END_QUANT_INDEX].firstChild.textContent !=
                row.childNodes[START_QUANT_INDEX].firstChild.textContent)
        {
            row.childNodes[END_QUANT_INDEX].style.color = "magenta";
        }
        else
        {
            row.childNodes[END_QUANT_INDEX].style.color = "lime";
        }

    }
    //console.log("roundEndQuants("+rows+") complete.");
}
function attackOneWay(aRows, dRows, attacker)
{
	var totalLosses = new Array();
	totalLosses[0] = 0;
	totalLosses[1] = 0;
	var cCenters = document.evaluate("//td[text() ='Command Centers']",document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null).snapshotItem(0);
	if( cCenters){ cCenters = parseInt(cCenters.parentNode.childNodes[1].textContent);}
	else{cCenters = 0;}

	//debug('CC: '+cCenters);

	var commander = document.evaluate("//td[text() ='Commander']",document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null).snapshotItem(0);
	var commanderLevel = 0;
	if(commander)
	{
		commander = commander.parentNode.childNodes[1].textContent;
		commander = commander.substring(commander.indexOf('(')+1, commander.indexOf(')'));
		commanderLevel = parseInt(commander.substring(commander.indexOf(" ")+1));
		commander = commander.substring(0,commander.indexOf(" "))
	}
	else{ commander = ""; }

	var levi = document.evaluate("//td[text() ='Leviathan']",document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null).snapshotItem(0);
	var attackLevi = false, defenseLevi = false;
	if(levi)
	{
		if(levi.parentNode.parentNode.firstChild.innerHTML.indexOf("Defensive") != -1)
		{
			defenseLevi = true;
		}
		else
		{
			attackLevi = true;
		}
	}

	var ds = document.evaluate("//td[text() ='Death Star']",document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null).snapshotItem(0);
	var attackDS = false, defenseDS = false;
	if(ds)
	{
		if(ds.parentNode.parentNode.firstChild.innerHTML.indexOf("Defensive") != -1)
		{
			defenseDS = true;
		}
		else
		{
			attackDS = true;
		}
	}

    for (var i = 0; i < aRows.snapshotLength; i++)
    {
        var aRow = aRows.snapshotItem(i);
        var aUnits = parseFloat(aRow.childNodes[START_QUANT_INDEX].firstChild.textContent );
        var aPower = parseFloat(aRow.childNodes[POWER_INDEX].firstChild.textContent);
        var aName = aRow.childNodes[NAME_INDEX].firstChild.nodeValue;


	// is this a turret structure?
        // this means use not so intelligent damage distribution, interesting...
        var aIsTurret = false;
        if (aName == "Barracks" ||
                aName == "Laser Turrets" ||
                aName == "Missle Turrets" ||
                aName == "Plasma Turrets" ||
                aName == "Ion Turrets" ||
                aName == "Photon Turrets" ||
                aName == "Disruptor Turrets" ||
                aName == "Deflection Shields" ||
                aName == "Planetary Shield" ||
                aName == "Planetary Ring")
        {
            aIsTurret = true;
        }

        //find power over shields
        var aBleedthru = 0.01;
        var aShieldDmg = 0.99;
        if (aName == "Ion Bombers" || aName == "Ion Frigate")
        {
            aBleedthru = 0.50;
            aShieldDmg = 0.50;

        }
		var pLevel = Math.round((((aPower/shipDefaultPower[getShipIndex(aName)])* 100) - 100)/5);
		if(attacker)
		{
			var offensivePercentBonus = 0;
			if(attackLevi && !attackDS)
			{
				offensivePercentBonus += 0.05;
			}
			if(attackDS)
			{
				offensivePercentBonus += 0.1;
			}
			if(offensivePercentBonus != 0)
			{
				offensivePercentBonus += 1;
				var newAPower = Math.round((aPower/offensivePercentBonus)*100)/100;
				//console.log(aName+" "+newAPower+" ~ " );
				pLevel = Math.round((((newAPower/shipDefaultPower[getShipIndex(aName)])* 100) - 100)/5);
			}
			if(attackerTech[shipWeaponTechIndex[getShipIndex(aName)]] < pLevel )
			{
				//console.log("Attacker Power: " + pLevel + " Tech Index: " + shipWeaponTechIndex[getShipIndex(aName)]);
				attackerTech[shipWeaponTechIndex[getShipIndex(aName)]] = pLevel;
			}
		}
		else
		{
			//var newAPower = 0;
			var offensivePercentBonus = 0;
			if(cCenters > 0 && !aIsTurret)
			{
				offensivePercentBonus += (cCenters * 0.05);
			}
			if(commander == "Tactical" && !aIsTurret)
			{
				offensivePercentBonus += (commanderLevel * 0.01);
			}
			if(commander == "Defense" && aIsTurret)
			{
				offensivePercentBonus += (commanderLevel * 0.01);
			}
			if(defenseLevi && !defenseDS && !aIsTurret)
			{
				offensivePercentBonus += 0.05;
			}
			if(defenseDS && !aIsTurret)
			{
				offensivePercentBonus += 0.1;
			}
			if(offensivePercentBonus != 0)
			{
				offensivePercentBonus += 1;
				var newAPower = Math.round((aPower/offensivePercentBonus)*100)/100;
				//console.log(aName+" "+newAPower+" ~ ");
				pLevel = Math.round((((newAPower/shipDefaultPower[getShipIndex(aName)])* 100) - 100)/5);
			}
			if( defenderTech[shipWeaponTechIndex[getShipIndex(aName)]] < pLevel )
			{
				//Scouts tech ony changes every few laser levels and so it throw the calculation off, ignore if there are other units.
				if( (defenderTech[shipWeaponTechIndex[getShipIndex(aName)]] == 0 && aName == "Scout Ship") || aName != "Scout Ship")
				{
					//console.log("Defender Power: " + pLevel + " Tech Index: " + shipWeaponTechIndex[getShipIndex(aName)]);
					defenderTech[shipWeaponTechIndex[getShipIndex(aName)]] = pLevel;
				}
			}
			//console.log(aName+" "+pLevel+" ~ " + shipDefaultPower[getShipIndex(aName)]);
		}


        while (aUnits > 0.0001) // prevent spinning
        {
            //find total defense size
            var dFleetTypeCount = 0;
            var totalDamagePerUnit = 0;
            for (var j = 0; j < dRows.snapshotLength; j++)
            {
                var dRow = dRows.snapshotItem(j);
                var dUnits = parseFloat(dRow.childNodes[END_QUANT_INDEX].firstChild.textContent) ;
                var dShield = dRow.childNodes[SHIELD_INDEX].firstChild.nodeValue - 0;
                if (dUnits > 0)
                {
                    totalDamagePerUnit = totalDamagePerUnit +
                    calcDamagePerUnitNew(aPower, dShield, aBleedthru, aShieldDmg)
                    dFleetTypeCount++;
                }
            }

            //console.log("dFleetTypeCount = "+dFleetTypeCount);
            if (dFleetTypeCount <= 0)
            {
                break;
            }

            var aUnitsUsed = 0;
            for (var j = 0; j < dRows.snapshotLength; j++)
            {
                var dRow = dRows.snapshotItem(j);
                var dName = dRow.childNodes[NAME_INDEX].firstChild.nodeValue;
                var dUnits = parseFloat(dRow.childNodes[END_QUANT_INDEX].firstChild.textContent);

                if (dUnits == 0)
                {
                    //console.log(dName+" group is destroyed, skipping.");
                    continue;
                }
				var dIsTurret = false;
		        if (dName == "Barracks" ||
		                dName == "Laser Turrets" ||
		                dName == "Missle Turrets" ||
		                dName == "Plasma Turrets" ||
		                dName == "Ion Turrets" ||
		                dName == "Photon Turrets" ||
		                dName == "Disruptor Turrets" ||
		                dName == "Deflection Shields" ||
		                dName == "Planetary Shield" ||
		                dName == "Planetary Ring")
		        {
		            dIsTurret = true;
		        }

                var dArmor = dRow.childNodes[ARMOR_INDEX].firstChild.nodeValue - 0;
                var dHp = dUnits * dArmor;
                var dShield = dRow.childNodes[SHIELD_INDEX].firstChild.nodeValue - 0;
				var aLevel = Math.round((((dArmor/shipDefaultArmour[getShipIndex(dName)])* 100) - 100)/5);


				var sLevel = 0;
				if(dShield != 0)
				{
					sLevel= (((dShield/shipDefaultShield[getShipIndex(dName)])* 100) - 100)/5;
				}

				if(!attacker)
				{
					var defensivePercentBonus = 0;
					if(commander == "Defense" && dIsTurret)
					{
						defensivePercentBonus += (commanderLevel * 0.01);
					}
					if(attackLevi && !attackDS)
					{
						defensivePercentBonus += 0.05;
					}
					if(attackDS)
					{
						defensivePercentBonus += 0.1;
					}
					if(defensivePercentBonus !=0)
					{
						defensivePercentBonus += 1;
						var newdArmour = Math.round((dArmor/defensivePercentBonus)*100)/100;
						//console.log(dName+" "+newdArmour+" ~ " );
						aLevel = (((newdArmour/shipDefaultArmour[getShipIndex(dName)])* 100) - 100)/5;
					}
					if( attackerTech[6] < aLevel )
					{
						attackerTech[6] = aLevel;
						//console.log("Attacker Armour: " + aLevel );
					}
					if( attackerTech[7] < sLevel )
					{
						attackerTech[7] = sLevel;
						//console.log("Attacker Shield: " + sLevel );
					}
				}
				else
				{
					var defensivePercentBonus = 0;
					if(commander == "Defense" && dIsTurret)
					{
						defensivePercentBonus += (commanderLevel * 0.01);
					}
					if(defenseLevi && !defenseDS)
					{
						defensivePercentBonus += 0.05;
					}
					if(defenseDS)
					{
						defensivePercentBonus += 0.1;
					}
					if(defensivePercentBonus !=0)
					{
						defensivePercentBonus += 1;
						var newdArmour = Math.round((dArmor/defensivePercentBonus)*100)/100;
						//console.log(dName+" "+newdArmour+" ~ " );
						aLevel = (((newdArmour/shipDefaultArmour[getShipIndex(dName)])* 100) - 100)/5;
					}
					if( defenderTech[6] < aLevel )
					{
						defenderTech[6] = aLevel;
						//console.log("Defender Armour: " + aLevel );
					}
					if( defenderTech[7] < sLevel )
					{
						defenderTech[7] = sLevel;
						//console.log("Defender Shield: " + sLevel );
					}
				}


                //var damagePerUnit = calcDamagePerUnit(aPower, dShield, aBleedthru);
                var damagePerUnit = calcDamagePerUnitNew(aPower, dShield, aBleedthru, aShieldDmg);
                //attackers for this defender group
                var attackingUnits = aUnits * damagePerUnit / totalDamagePerUnit;
                if (aIsTurret)
                {
                    attackingUnits = aUnits / dFleetTypeCount;
                }
                var damage = attackingUnits * damagePerUnit; //max damage
                //console.log(aName+" attackingUnits("+attackingUnits+") * damagePerUnit("+damagePerUnit+") = damage("+damage+")");
				//var remaining = Math.round(Math.round((((dHp - damage) / dArmor)*100))/100);//
				var remaining = (dHp - damage) / dArmor;
				if(remaining < 0){
					remaining = 0;}
                if (damage >= dHp)
                {
                    dRow.childNodes[END_QUANT_INDEX].firstChild.textContent = 0;
                    aUnitsUsed = aUnitsUsed + dHp / damagePerUnit;
					remaining = 0;
                    //console.log(dName+" units destroyed!\n"+
                    //        "\tdHp / damagePerUnit = "+(dHp/damagePerUnit)+"\n"+
                    //        "\taUnitsUsed = "+aUnitsUsed);
                }
                else
                {

                    dRow.childNodes[END_QUANT_INDEX].firstChild.textContent =
                        remaining;
			
                    aUnitsUsed = aUnitsUsed + attackingUnits;

                }
				if(!dIsTurret)
				{
					var s = shipValues[getShipIndex(dName)];
					if (!s)
	                {
						s = 1;
					}
					var lost = roundUp(dUnits - Math.ceil(remaining),findScale(dName));
					if(lost > 0 )
					{
						lost = Math.ceil(lost);
						totalLosses[0] += lost*s;
						totalLosses[1] += Math.floor(lost * Math.floor((2*aLevel*s)/100));
					}
				}
            }
            aUnits = aUnits - aUnitsUsed;
        }

    }
	return totalLosses;
}
function initEndQuants(rows)
{
    for (var i = 0; i < rows.snapshotLength; i++)
    {
        var row = rows.snapshotItem(i);
        row.childNodes[END_QUANT_INDEX].firstChild.textContent =
            row.childNodes[START_QUANT_INDEX].firstChild.textContent;
    }
}
function runBattleCalc()
{
    var startTime = new Date();
    var attackerRows = document.evaluate(
            "//table//th[contains(text(),'Attack Force') and @colspan='6']/../..//tr[@align='center']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
    var defenderRows = document.evaluate(
            "//table//th[contains(text(),'Defensive Force') and @colspan='6']/../..//tr[@align='center']",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null);
    initEndQuants(attackerRows);
    initEndQuants(defenderRows);

    var defendLosses = attackOneWay(attackerRows, defenderRows, true);
    var attackLosses = attackOneWay(defenderRows, attackerRows, false);

    roundEndQuants(attackerRows);
    roundEndQuants(defenderRows);

	estimateLosses(attackLosses, defendLosses);

    var endTime = new Date();
    var runSeconds = endTime.getTime() - startTime.getTime();
}
function insertTechInformation( battleReport)
{
	var aA = "-", dA = "-",
		aL = "-", dL = "-",
		aM = "-", dM = "-",
		aP = "-", dP = "-",
		aS = "-", dS = "-",
		aI = "-", dI = "-",
		aPh = "-", dPh = "-",
		aD = "-", dD = "-";
	if(attackerTech[6] != 0)
		aA = attackerTech[6]+"";
	if(attackerTech[0] != 0)
		aL = attackerTech[0]+"";
	if(attackerTech[1] != 0)
		aM = attackerTech[1]+"";
	if(attackerTech[2] != 0)
		aP = attackerTech[2]+"";
	if(attackerTech[7] != 0)
		aS = attackerTech[7]+"";
	if(attackerTech[3] != 0)
		aI = attackerTech[3]+"";
	if(attackerTech[4] != 0)
		aPh = attackerTech[4]+"";
	if(attackerTech[5] != 0)
		aD = attackerTech[5]+"";
	if(defenderTech[6] != 0)
		dA = defenderTech[6]+"";
	if(defenderTech[0] != 0)
		dL = defenderTech[0]+"";
	if(defenderTech[1] != 0)
		dM = defenderTech[1]+"";
	if(defenderTech[2] != 0)
		dP = defenderTech[2]+"";
	if(defenderTech[7] != 0)
		dS = defenderTech[7]+"";
	if(defenderTech[3] != 0)
		dI = defenderTech[3]+"";
	if(defenderTech[4] != 0)
		dPh = defenderTech[4]+"";
	if(defenderTech[5] != 0)
		dD = defenderTech[5]+"";
	var techTable = "<table id='techInfo' class='battle-report_attack' ><tbody><tr><th colspan='2'>Attackers Tech</th><th colspan='2'>Defenders Tech</th></tr>"+
		"<tr><th>Technology</th><th>Level</th><th>Technology</th><th>Level</th></tr>"+
		"<tr><td align='center'>Armour</td><td align='center'>"+aA+"</td><td align='center'>Armour</td><td align='center'>"+dA+"</td></tr>"+
		"<tr><td align='center'>Laser</td><td align='center'>"+aL+"</td><td align='center'>Laser</td><td align='center'>"+dL+"</td></tr>"+
		"<tr><td align='center'>Missiles</td><td align='center'>"+aM+"</td><td align='center'>Missiles</td><td align='center'>"+dM+"</td></tr>"+
		"<tr><td align='center'>Plasma</td><td align='center'>"+aP+"</td><td align='center'>Plasma</td><td align='center'>"+dP+"</td></tr>"+
		"<tr><td align='center'>Shielding</td><td align='center'>"+aS+"</td><td align='center'>Shielding</td><td align='center'>"+dS+"</td></tr>"+
		"<tr><td align='center'>Ion</td><td align='center'>"+aI+"</td><td align='center'>Ion</td><td align='center'>"+dI+"</td></tr>"+
		"<tr><td align='center'>Photon</td><td align='center'>"+aPh+"</td><td align='center'>Photon</td><td align='center'>"+dPh+"</td></tr>"+
		"<tr><td align='center'>Disruptor</td><td align='center'>"+aD+"</td><td align='center'>Disruptor</td><td align='center'>"+dD+"</td></tr>"+

		"</tbody></table><br/>";
	battleReport.innerHTML += techTable;
}
function estimateLosses(attackLosses, defendLosses)
{
	var bres = document.evaluate(
		"//div[@class ='battle-report']",
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null);
	for (var i = 0; i < bres.snapshotLength; i++)
	{
		var br = bres.snapshotItem(i);
		insertTechInformation(br);
		var TotalLosses = attackLosses[0]+defendLosses[0]

		var derbsMade = attackLosses[1]+defendLosses[1];
		var newHtml = "<center> Estimated total cost of units destroyed: " + TotalLosses +"<small>( Attacker: "+attackLosses[0]+" ; Defender: "+defendLosses[0]+" )</small></center>";
		newHtml += "<center>Estimated debris in space: "+derbsMade+"</center>";
		br.innerHTML += newHtml;
	}
}
function getShipIndex (shipName){
    switch(shipName)
    {
        case "Fighters": {
            return FT_INDEX;
        }
        case "Bombers": {
             return BO_INDEX;
        }
        case "Heavy Bombers": {
             return HB_INDEX;
        }
        case "Ion Bombers": {
             return IB_INDEX;
        }
        case "Corvette": {
             return CV_INDEX;
        }
        case "Recycler": {
             return RC_INDEX;
        }
        case "Destroyer": {
             return DE_INDEX;
        }
        case "Frigate": {
             return FR_INDEX;
        }
        case "Ion Frigate": {
             return IF_INDEX;
        }
        case "Scout Ship": {
             return SS_INDEX;
        }
        case "Outpost Ship": {
             return OS_INDEX;
        }
         case "Cruiser": {
             return CR_INDEX;
        }
         case "Carrier": {
             return CA_INDEX;
        }
         case "Heavy Cruiser": {
             return HC_INDEX;
        }
         case "Battleship": {
             return BC_INDEX;
        }
         case "Fleet Carrier": {
             return FC_INDEX;
        }
         case "Dreadnought": {
             return DN_INDEX;
        }
         case "Titan": {
             return TI_INDEX;
        }
         case "Leviathan": {
             return LE_INDEX;
        }
         case "Death Star": {
             return DS_INDEX;
        }
         case "Barracks": {
             return BARRACKS_INDEX;
        }
         case "Laser Turrets": {
             return LASER_TURRETS_INDEX;
        }
         case "Missle Turrets": {
             return MISSLE_TURRETS_INDEX;
        }
         case "Plasma Turrets": {
             return PLASMA_TURRENTS_INDEX;
        }
         case "Ion Turrets": {
             return ION_TURRETS_INDEX;
        }
         case "Photon Turrets": {
             return PHOTON_TURRETS_INDEX;
        }
         case "Disruptor Turrets": {
             return DISRUPTOR_TURRETS_INDEX;
        }
         case "Deflection Shields": {
             return DEFLECTION_SHIELDS_INDEX;
        }
         case "Planetary Shield": {
             return PLANETARY_SHIELD_INDEX;
        }
         case "Planetary Ring": {
             return PLANETARY_RING_INDEX;
        }
    }
}
if (isConfirmPage){
try{
	runBattleCalc();
} catch (e) {
}
}
// totalEnd = new Date();
//==========================================
// End of Battlecalc code
//==========================================



