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
    darkColor: '#6e6e2e',
    brightColor: '#f8f8c0',
  },
  High: {
    name: 'High',
    darkColor: '#29a400',
    brightColor: '#3cff00',
  },
  Extreme: {
    name: 'Extreme',
    darkColor: '#00bbff',
    brightColor: '#00bbff',
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
      property: 'data.data.attributes.ac.base',
      selector: 'DIV.side-bar-label.armor-label   H4',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'HP',
      type: 'hp',
      property: 'data.data.attributes.hp.base',
      selector: 'DIV.health-section.side-bar-section   H4',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Perception',
      type: 'perception',
      property: 'data.data.attributes.perception.base',
      selector: 'DIV.perception.labelled-field   A',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Fortitude',
      type: 'save',
      property: 'data.data.saves.fortitude.base',
      selector: 'DIV[data-save="fortitude"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Reflex',
      type: 'save',
      property: 'data.data.saves.reflex.base',
      selector: 'DIV[data-save="reflex"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Will',
      type: 'save',
      property: 'data.data.saves.will.base',
      selector: 'DIV[data-save="will"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Strength',
      type: 'ability',
      property: 'data.data.abilities.str.mod',
      selector: 'DIV[data-attribute="str"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Dexterity',
      type: 'ability',
      property: 'data.data.abilities.dex.mod',
      selector: 'DIV[data-attribute="dex"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Constitution',
      type: 'ability',
      property: 'data.data.abilities.con.mod',
      selector: 'DIV[data-attribute="con"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Intelligence',
      type: 'ability',
      property: 'data.data.abilities.int.mod',
      selector: 'DIV[data-attribute="int"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Wisdom',
      type: 'ability',
      property: 'data.data.abilities.wis.mod',
      selector: 'DIV[data-attribute="wis"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
    {
      name: 'Charisma',
      type: 'ability',
      property: 'data.data.abilities.cha.mod',
      selector: 'DIV[data-attribute="cha"]   LABEL',
      styleToChange: 'color',
      hasDarkBackground: false,
    },
  ]
}

const getSimpleScale = (baseValue, level, statisticType) => {
  // using the relevant scale, picking the value that is closest to the base value
  const scaleNumbers = {
    ac: TABLES.AC,
    hp: TABLES.HP,
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
  const currentModeNum = game.settings.get(MODULE_ID, 'current-mode-num')
  const currentMode = MODE_OPTIONS[currentModeNum]
  const simpleScale = getSimpleScale(statisticValue, npc.level, statistic.type)
  const newColor = statistic.hasDarkBackground ? simpleScale.brightColor : simpleScale.darkColor
  if (currentMode === 'Disabled') {
    html.find(statistic.selector)[0].style.removeProperty(statistic.styleToChange)
  } else {
    html.find(statistic.selector)[0].style.setProperty(statistic.styleToChange, newColor)
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
      styleToChange: 'color',
      hasDarkBackground: false,
    }
    // `base` will not be undefined for anything that is visibly there
    const skillValue = getProperty(npc, `data.data.skills.${slug}.base`)
    calculateAndMarkStatisticInNpcSheet(html, npc, statistic, skillValue)
  }
  for (const attackElem of html.find('OL.attacks-list   LI.attack')) {
    const actionIndex = parseInt(attackElem.dataset.actionIndex)
    const attackBonus = npc.data.data.actions[actionIndex].item.data.data.bonus.value
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Strike Attack Bonus',
      type: 'strike_attack',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.attacks-list   LI.attack[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-attack"][data-variant-index="0"]`,
      styleToChange: 'color',
      hasDarkBackground: true,
    }, attackBonus)
    const damageRolls = npc.data.data.actions[actionIndex].item.data.data.damageRolls
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
      hasDarkBackground: true,
    }, avgTotalDamage)
  }
  for (const spellcastingElem of html.find('DIV.tab.spells   LI.spellcasting-entry')) {
    const spellcastingItemId = spellcastingElem.dataset.itemId
    const spellcasting = npc.spellcasting.get(spellcastingItemId)
    const spellAttack = spellcasting.data.data.spelldc.value
    const spellDc = spellcasting.data.data.spelldc.dc
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Spell Attack Bonus',
      type: 'spell_attack',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellAttack   label`,
      styleToChange: 'color',
      hasDarkBackground: true,
    }, spellAttack)
    calculateAndMarkStatisticInNpcSheet(html, npc, {
      name: 'Spell DC',
      type: 'spell_dc',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellDC   label`,
      styleToChange: 'color',
      hasDarkBackground: true,
    }, spellDc)
  }
}

const addButtonToNpcSheet = (sheet, html) => {
  let currentModeNum = game.settings.get(MODULE_ID, 'current-mode-num')
  const maybeActive = MODE_OPTIONS[currentModeNum] !== 'Disabled' ? 'active' : ''
  const text = game.i18n.localize(`${MODULE_ID}.ToggleButton`)
  const newNode = `<div class="pf2e-see-simple-scale-statistics-change-mode ${maybeActive}"><a>${text}</a></div>`
  html.find('DIV.adjustment.elite').before(newNode)
  html.find('DIV.pf2e-see-simple-scale-statistics-change-mode > a').click(() => {
    currentModeNum = (currentModeNum + 1) % MODE_OPTIONS.length
    game.settings.set(MODULE_ID, 'current-mode-num', currentModeNum)
    html.find('DIV.pf2e-see-simple-scale-statistics-change-mode').toggleClass('active')
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
    if (sheet.object.data.type !== 'npc') return
    addButtonToNpcSheet(sheet, html)
    markStatisticsInNpcSheet(sheet, html)
  })
  console.log(`${MODULE_ID}: Initialized`)
})
