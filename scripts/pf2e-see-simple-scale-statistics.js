import { initializeTables, TABLES } from './statistics_tables.js'

const MODULE_ID = 'pf2e-see-simple-scale-statistics'

const SCALE = {
  Terrible: {
    name: 'Terrible',
    darkColor: '#ff0000',
    brightColor: '#ff0000',
  },
  Low: {
    name: 'Low',
    darkColor: '#ff8000',
    brightColor: '#ff8000',
  },
  Moderate: {
    name: 'Moderate',
    darkColor: '#ffff54',
    brightColor: '#ffff54',
  },
  High: {
    name: 'High',
    darkColor: '#3cff00',
    brightColor: '#3cff00',
  },
  Extreme: {
    name: 'Extreme',
    darkColor: '#6cd8ff',
    brightColor: '#6cd8ff',
  },
}

const isCloserToMiddle = (key1, key2) => {
  if (key1 === 'Moderate') return true
  if (key2 === 'Moderate') return false
  return key1 === 'Low' || key1 === 'High'
}

const getMainNpcStatistics = () => {
  return [
    {
      name: 'AC',
      type: 'ac',
      property: 'system.attributes.ac.base',
      selector: 'DIV.side-bar-label.armor-label   H4',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'HP',
      type: 'hp',
      property: 'system.attributes.hp.base',
      selector: 'DIV.health-section.side-bar-section   H4',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Perception',
      type: 'perception',
      property: 'system.attributes.perception.base',
      selector: 'DIV.perception.labelled-field   A',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Fortitude',
      type: 'save',
      property: 'system.saves.fortitude.base',
      selector: 'DIV[data-save="fortitude"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Reflex',
      type: 'save',
      property: 'system.saves.reflex.base',
      selector: 'DIV[data-save="reflex"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Will',
      type: 'save',
      property: 'system.saves.will.base',
      selector: 'DIV[data-save="will"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Strength',
      type: 'ability',
      property: 'system.abilities.str.mod',
      selector: 'DIV[data-attribute="str"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Dexterity',
      type: 'ability',
      property: 'system.abilities.dex.mod',
      selector: 'DIV[data-attribute="dex"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Constitution',
      type: 'ability',
      property: 'system.abilities.con.mod',
      selector: 'DIV[data-attribute="con"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Intelligence',
      type: 'ability',
      property: 'system.abilities.int.mod',
      selector: 'DIV[data-attribute="int"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Wisdom',
      type: 'ability',
      property: 'system.abilities.wis.mod',
      selector: 'DIV[data-attribute="wis"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
    {
      name: 'Charisma',
      type: 'ability',
      property: 'system.abilities.cha.mod',
      selector: 'DIV[data-attribute="cha"]   LABEL',
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    },
  ]
}

const getSimpleScale = (baseValue, level, statisticType) => {
  // using the relevant scale, picking the value that is closest to the base value
  const scaleNumbers = {
    ac: TABLES.AC,
    hp: TABLES.HP,
    weaknesses: TABLES.WEAKNESSES,
    resistances: TABLES.RESISTANCES,
    perception: TABLES.PERCEPTION,
    save: TABLES.SAVES,
    ability: TABLES.ABILITY_MODIFIER,
    skill: TABLES.SKILLS,
    spell_attack: TABLES.SPELL_ATTACK,
    spell_dc: TABLES.SPELL_DC,
    strike_attack: TABLES.STRIKE_ATTACK,
    strike_damage: TABLES.STRIKE_DAMAGE,
  }[statisticType][level]
  let closestKey = null
  let closestDiff = null
  for (const [key, value] of Object.entries(scaleNumbers)) {
    if (value === null) continue
    const diff = Math.abs(baseValue - value)
    if (closestDiff === null || diff < closestDiff
      // tiebreaking towards middle - e.g. if +15 is High and +13 is Moderate, a +14 will count as Moderate
      || (diff === closestDiff && isCloserToMiddle(key, closestKey))) {
      closestKey = key
      closestDiff = diff
    }
  }
  return SCALE[closestKey]
}

const calculateAndMarkStatisticInNpcSheet = (html, npc, statistic, statisticValue) => {
  if (typeof statisticValue !== 'number') {
    console.warn(`got non-number as statistic value: ${statistic.name} = ${statisticValue}`)
    return
  }
  const foundSelector = html.find(statistic.selector)
  if (!foundSelector) {
    console.warn(`failed to find selector ${statistic.selector} for actor ${npc.name}, statistic ${statistic.name}`)
    return
  }
  const currentModeNum = game.settings.get(MODULE_ID, 'current-mode-num')
  const currentMode = MODE_OPTIONS[currentModeNum]
  const simpleScale = getSimpleScale(statisticValue, npc.level, statistic.type)
  const newColor = statistic.hasDarkBackground ? simpleScale.brightColor : simpleScale.darkColor
  if (currentMode === 'Disabled') {
    foundSelector[0].style.removeProperty(statistic.styleToChange)
  } else {
    foundSelector[0].style.setProperty(statistic.styleToChange, statistic.valueTemplate.replace('$c', newColor))
  }
}

const calcAvgDamage = (damageText) => {
  // a bit hacky
  const damageWithMultiplication = damageText.replace(
    /(\d+)d(\d+)/,
    (all, dCount, dNum) => `${dCount}/2*(${dNum}+1)`
  )
  const isMathExpression = /^[\s\d-+*/.()_]*$/.test(damageWithMultiplication)
  if (!isMathExpression) return -99999
  // eval is evil, but we did make sure it's a math expression
  return eval(damageWithMultiplication)
}

const markStatisticsInNpcSheet = (sheet, html) => {
  const npc = sheet.object
  for (const statistic of getMainNpcStatistics()) {
    calculateAndMarkStatisticInNpcSheet(html, npc, statistic, getProperty(npc, statistic.property))
  }
  for (const skillElem of html.find('DIV.skills.section-container   DIV.list   DIV.skill-entry')) {
    const slug = skillElem.dataset.skill
    const statistic = {
      name: 'Skill',
      type: 'skill',
      selector: `DIV.skills.section-container   DIV.list   DIV[data-skill="${slug}"]   a`,
      styleToChange: 'text-shadow',
      valueTemplate: '0 0 10px $c',
      hasDarkBackground: false,
    }
    // `base` will not be undefined for anything that is visibly there
    const skillValue = getProperty(npc, `system.skills.${slug}.base`)
    calculateAndMarkStatisticInNpcSheet(html, npc, statistic, skillValue)
  }
  html.find('DIV.weaknesses   DIV.side-bar-section-content    DIV.weakness').each((index) => {
    const nth = index + 1
    const statistic = {
        name: 'Weaknesses',
        type: 'weaknesses',
        selector: `DIV.weaknesses   DIV.side-bar-section-content    DIV.weakness:nth-child(${nth})`,
        styleToChange: 'text-shadow',
        valueTemplate: '0 0 10px $c',
        hasDarkBackground: false,
      }
    const value = getProperty(npc, `system.traits.dv`)[index].value
    calculateAndMarkStatisticInNpcSheet(html, npc, statistic, value)
  })
  html.find('DIV.resistances   DIV.side-bar-section-content    DIV.resistance').each((index) => {
    // const slug = skillElem.dataset.weakness  // TODO - probably PF2e system bug  https://github.com/foundryvtt/pf2e/issues/3657
    const nth = index + 1
    const statistic = {
        name: 'Resistances',
        type: 'resistances',
        selector: `DIV.resistances   DIV.side-bar-section-content    DIV.resistance:nth-child(${nth})`,
        styleToChange: 'text-shadow',
        valueTemplate: '0 0 10px $c',
        hasDarkBackground: false,
      }
    const value = getProperty(npc, `system.traits.dr`)[index].value
    calculateAndMarkStatisticInNpcSheet(html, npc, statistic, value)
  })
  for (const attackElem of html.find('OL.attacks-list   LI.attack')) {
    const actionIndex = parseInt(attackElem.dataset.actionIndex)
    const attackBonus = npc.system.actions[actionIndex].item.system.bonus.value
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Strike Attack Bonus',
      type: 'strike_attack',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.attacks-list   LI.attack[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-attack"][data-variant-index="0"]`,
      styleToChange: 'color',
      valueTemplate: '$c',
      hasDarkBackground: true,
    }, attackBonus)
    const damageRolls = npc.system.actions[actionIndex].item.system.damageRolls
    const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData.damage), 0)
    if (avgTotalDamage < 0) {
      // failed parsing math expression
      continue
    }
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Strike Damage',
      type: 'strike_damage',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.attacks-list   LI.attack[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-damage"]`,
      styleToChange: 'color',
      valueTemplate: '$c',
      hasDarkBackground: true,
    }, avgTotalDamage)
  }
  for (const spellcastingElem of html.find('DIV.tab.spells   LI.spellcasting-entry')) {
    const spellcastingItemId = spellcastingElem.dataset.itemId
    const spellcasting = npc.spellcasting.get(spellcastingItemId)
    const spellAttack = spellcasting.system.spelldc.value
    const spellDc = spellcasting.system.spelldc.dc
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Spell Attack Bonus',
      type: 'spell_attack',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellAttack   label`,
      styleToChange: 'color',
      valueTemplate: '$c',
      hasDarkBackground: true,
    }, spellAttack)
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Spell DC',
      type: 'spell_dc',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellDC   label`,
      styleToChange: 'color',
      valueTemplate: '$c',
      hasDarkBackground: true,
    }, spellDc)
  }
}

const colorLegend = (maybeActive) => {
  return `
    <div class="pf2e-see-simple-scale-statistics-colors-legend ${maybeActive}">
      <div class="pf2e-see-simple-scale-statistics-color-in-legend" style="background-color: ${SCALE.Terrible.brightColor};"></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend" style="background-color: ${SCALE.Low.brightColor};"></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend" style="background-color: ${SCALE.Moderate.brightColor};"></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend" style="background-color: ${SCALE.High.brightColor};"></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend" style="background-color: ${SCALE.Extreme.brightColor};"></div>
    </div>
  `
}

const addButtonToNpcSheet = (sheet, html) => {
  let currentModeNum = game.settings.get(MODULE_ID, 'current-mode-num')
  const isEnabled = MODE_OPTIONS[currentModeNum] !== 'Disabled'
  const maybeActive = isEnabled ? 'active' : ''
  const text = game.i18n.localize(`${MODULE_ID}.ToggleButton`)
  const newNode = `
<div class="pf2e-see-simple-scale-statistics-change-mode ${maybeActive}">
  <div>
    <a>${text}</a>
  </div>
  ${colorLegend(maybeActive)}
</div>
`
  const $eliteElement = html.find('DIV.adjustment.elite')
  if ($eliteElement.length > 0) {
    html.find('DIV.adjustment.elite').before(newNode)
  } else {
    // e.g. for NPC sheets opened through compendium
    html.find('HEADER.npc-sheet-header > div:nth-child(2)').append(`
<div class="adjustment-select flexrow" style="flex: auto; justify-content: flex-end;">
${newNode}
</div>
`)
  }
  html.find('DIV.pf2e-see-simple-scale-statistics-change-mode > div > a').click(() => {
    currentModeNum = (currentModeNum + 1) % MODE_OPTIONS.length
    game.settings.set(MODULE_ID, 'current-mode-num', currentModeNum)
    html.find('DIV.pf2e-see-simple-scale-statistics-change-mode').toggleClass('active')
    html.find('DIV.pf2e-see-simple-scale-statistics-colors-legend').toggleClass('active')
    markStatisticsInNpcSheet(sheet, html)
  })
}

const MODE_OPTIONS = ['Disabled', 'Show color-coded stats',]

const registerSettings = () => {
  game.settings.register(MODULE_ID, 'current-mode-num', {
    name: `Current Mode`,
    hint: `Switch mode - disabled, or show color-coded stats`,
    scope: 'client',
    config: false,
    type: Number,
    default: 0,
    choices: { 0: MODE_OPTIONS[0], 1: MODE_OPTIONS[1] },
  })
}

Hooks.once('init', () => {
  initializeTables()
  registerSettings()
  Hooks.on('renderActorSheetPF2e', (sheet, html, _) => {
    if (sheet.object.type !== 'npc') return
    addButtonToNpcSheet(sheet, html)
    markStatisticsInNpcSheet(sheet, html)
  })
  console.log(`${MODULE_ID}: Initialized`)
})
