import { initializeTables, TABLES } from './statistics_tables.js'

const MODULE_ID = 'pf2e-see-simple-scale-statistics'

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
      property: '_source.system.attributes.ac.value',
      selector: 'input[data-property="system.attributes.ac.value"]',
      ittSelector: 'div[data-section="ac"]',
      styleOptionUsed: 'primary',
    },
    {
      name: 'HP',
      type: 'hp',
      property: '_source.system.attributes.hp.max',
      selector: 'input[data-property="system.attributes.hp.max"]',
      ittSelector: 'div[data-section="hp"]',
      styleOptionUsed: 'primary',
    },
    {
      name: 'Perception',
      type: 'perception',
      property: '_source.system.perception.mod',
      selector: 'input[data-property="system.perception.mod"]',
      ittSelector: 'a[data-slug="perception"]',
      styleOptionUsed: 'primary',
    },
    {
      name: 'Fortitude',
      type: 'save',
      property: '_source.system.saves.fortitude.value',
      selector: 'input[data-property="system.saves.fortitude.value"]',
      ittSelector: 'a[data-save="fortitude"]',
      styleOptionUsed: 'primary',
    },
    {
      name: 'Reflex',
      type: 'save',
      property: '_source.system.saves.reflex.value',
      selector: 'input[data-property="system.saves.reflex.value"]',
      ittSelector: 'a[data-save="reflex"]',
      styleOptionUsed: 'primary',
    },
    {
      name: 'Will',
      type: 'save',
      property: '_source.system.saves.will.value',
      selector: 'input[data-property="system.saves.will.value"]',
      ittSelector: 'a[data-save="will"]',
      styleOptionUsed: 'primary',
    },
    {
      name: 'Strength',
      type: 'ability',
      property: '_source.system.abilities.str.mod',
      selector: 'input[data-property="system.abilities.str.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
    },
    {
      name: 'Dexterity',
      type: 'ability',
      property: '_source.system.abilities.dex.mod',
      selector: 'input[data-property="system.abilities.dex.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
    },
    {
      name: 'Constitution',
      type: 'ability',
      property: '_source.system.abilities.con.mod',
      selector: 'input[data-property="system.abilities.con.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
    },
    {
      name: 'Intelligence',
      type: 'ability',
      property: '_source.system.abilities.int.mod',
      selector: 'input[data-property="system.abilities.int.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
    },
    {
      name: 'Wisdom',
      type: 'ability',
      property: '_source.system.abilities.wis.mod',
      selector: 'input[data-property="system.abilities.wis.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
    },
    {
      name: 'Charisma',
      type: 'ability',
      property: '_source.system.abilities.cha.mod',
      selector: 'input[data-property="system.abilities.cha.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
    },
  ]
}

const getSimpleScale = (baseValue, level, statisticType) => {
  if (level >= 25 || level < -1) {
    // stats are off the charts.  we'll do the best we can by treating this as level 24 or level -1.
    // (this comes up with the Tarrasque, level 25 creature)
    level = Math.max(-1, Math.min(24, level))
  }
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
  return closestKey
}

const calculateAndMarkStatisticInHtml = (html, npc, statistic, statisticValue) => {
  if (typeof statisticValue !== 'number') {
    console.error(`got non-number as statistic value: ${statistic.name} = ${statisticValue}`)
    return
  }
  const foundSelector = html.find(statistic.selector)
  if (!foundSelector[0]) {
    console.error(
      `failed to find selector \`${statistic.selector}\` for actor ${npc.name}, statistic ${statistic.name}`)
    return
  }
  const isEnabled = game.settings.get(MODULE_ID, 'toggle-on')
  const useColors = game.settings.get(MODULE_ID, 'mark-with-colors')
  const useBorders = game.settings.get(MODULE_ID, 'mark-with-borders')
  const scaleKeyWord = getSimpleScale(statisticValue, npc.level, statistic.type)
  const addOrRemoveClass = (isEnabled ? foundSelector.addClass : foundSelector.removeClass).bind(foundSelector)
  if (useColors) {
    addOrRemoveClass(`${MODULE_ID}-${scaleKeyWord}-color-${statistic.styleOptionUsed}`)
  }
  if (useBorders) {
    addOrRemoveClass(`${MODULE_ID}-${scaleKeyWord}-border-${statistic.styleOptionUsed}`)
  }
}

const calcAvgDamage = (damageText) => {
  // a bit hacky
  const damageWithMultiplication = damageText.replace(
    /(\d+)d(\d+)/,
    (all, dCount, dNum) => `${dCount}/2*(${dNum}+1)`,
  )
  const isMathExpression = /^[\s\d-+*/.()_]*$/.test(damageWithMultiplication)
  if (!isMathExpression) return -99999
  // eval is evil, but we did make sure it's a math expression
  return eval(damageWithMultiplication)
}

/**
 * I chose to double the value of "wide" resistances, even though it's technically misleading.  The system rules suggest using Low for
 * these wide resistances and High for narrow resistances, for balance reasons.  However, GMs who use SSSS are probably trying to
 * either quickly see a creature's most important attributes at a glance, or to build a creature.  That makes it confusing
 * when seeing a number marked as Low even though having a wide resistance is actually a big power-up.
 * @param resistanceOrWeaknessData
 * @returns {number}
 */
const artificiallyInflateIfVeryCommonType = (resistanceOrWeaknessData) => {
  const typeName = resistanceOrWeaknessData.type
  if (['physical', 'all-damage'].includes(typeName) &&
    game.settings.get(MODULE_ID, 'treat-broad-iwr-as-more-important')) {
    return 2
  }
  return 1
}

const markStatisticsInNpcSheet = (npc, html) => {
  // HP, AC, Perception, Saves, and Ability mods - all easy to access and set
  for (const statistic of getMainNpcStatistics()) {
    calculateAndMarkStatisticInHtml(html, npc, statistic, foundry.utils.getProperty(npc, statistic.property))
  }

  // Skills
  for (const skillElem of html.find('DIV.skills.section-container   DIV.list   DIV.skill-entry')) {
    const longSlug = skillElem.dataset.statistic
    const statistic = {
      name: `Skill: ${longSlug}`,
      type: 'skill',
      selector: `DIV.skills.section-container   DIV.list   DIV[data-statistic="${longSlug}"]   a`,
      styleOptionUsed: 'primary',
    }
    // `base` will not be undefined for anything that is visibly there
    const skillValue = getSkillProperty(npc, longSlug)
    calculateAndMarkStatisticInHtml(html, npc, statistic, skillValue)
  }

  // Weaknesses and Resistances
  html.find('li[data-weakness]').each((index) => {
    const statistic = {
      name: 'Weaknesses',
      type: 'weaknesses',
      selector: `li[data-weakness]:nth(${index})`,
      styleOptionUsed: 'primary',
    }
    // note that weaknesses are flipped - so that a high weakness is colored as "low" (because it's a negative).
    // they are already flipped in the statistics tables, but this comment is here to remind you of this.
    const weaknessData = foundry.utils.getProperty(npc, `system.attributes.weaknesses`)[index]
    const weaknessValue = weaknessData.value * artificiallyInflateIfVeryCommonType(weaknessData)
    calculateAndMarkStatisticInHtml(html, npc, statistic, weaknessValue)
  })
  html.find('li[data-resistance]').each((index) => {
    const statistic = {
      name: 'Resistances',
      type: 'resistances',
      selector: `li[data-resistance]:nth(${index})`,
      styleOptionUsed: 'primary',
    }
    const resistanceData = foundry.utils.getProperty(npc, `system.attributes.resistances`)[index]
    const resistanceValue = resistanceData.value * artificiallyInflateIfVeryCommonType(resistanceData)
    calculateAndMarkStatisticInHtml(html, npc, statistic, resistanceValue)
  })

  // Attacks/Strikes (marking both attack bonus and damage dice/numbers)
  for (const attackElem of html.find('OL.strikes-list   LI.item.action')) {
    const actionIndex = parseInt(attackElem.dataset.actionIndex)
    const attackBonus = npc.system.actions[actionIndex].item.system.bonus.value
    calculateAndMarkStatisticInHtml(html, npc, {
      name: 'Strike Attack Bonus',
      type: 'strike_attack',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.strikes-list   LI.item.action[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-attack"][data-variant-index="0"]`,
      styleOptionUsed: 'secondary',
    }, attackBonus)
    const damageRolls = npc.system.actions[actionIndex].item.system.damageRolls
    const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData.damage), 0)
    if (avgTotalDamage === 0) {
      // no damage, e.g. web attack
      continue
    }
    if (avgTotalDamage < 0) {
      const actionName = npc.system.actions[actionIndex].item.name
      console.error(`failed parsing math expression for strike damage: actor ${npc.name}, attack ${actionName}`)
      continue
    }
    calculateAndMarkStatisticInHtml(html, npc, {
      name: 'Strike Damage',
      type: 'strike_damage',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.strikes-list   LI.item.action[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-damage"]`,
      styleOptionUsed: 'secondary',
    }, avgTotalDamage)
  }

  // Spell attack and spell DC
  for (const spellcastingElem of html.find('DIV.tab.spells   LI.spellcasting-entry')) {
    const spellcastingItemId = spellcastingElem.dataset.itemId
    const spellcasting = npc.spellcasting.get(spellcastingItemId)
    if (spellcasting.system?.spelldc === undefined) continue  // skipping "rituals" which is a spellcasting section
    const spellAttack = spellcasting.system.spelldc.value
    const spellDc = spellcasting.system.spelldc.dc
    calculateAndMarkStatisticInHtml(html, npc, {
      name: 'Spell Attack Bonus',
      type: 'spell_attack',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellAttack   label`,
      styleOptionUsed: 'secondary',
    }, spellAttack)
    calculateAndMarkStatisticInHtml(html, npc, {
      name: 'Spell DC',
      type: 'spell_dc',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellDC   label`,
      styleOptionUsed: 'secondary',
    }, spellDc)
  }
}

const markStatisticsInNpcInteractiveTokenTooltip = (npc, html) => {
  // HP, AC, Perception, Saves
  for (const statistic of getMainNpcStatistics().filter(s => s.ittSelector !== undefined)) {
    if (game.settings.get('pf2e-token-hud', 'saves') === 'none')
      if (['Fortitude', 'Reflex', 'Will'].includes(statistic.name))
        continue
    if (game.settings.get('pf2e-token-hud', 'others') === 'none')
      if (['Perception'].includes(statistic.name))
        continue
    statistic.selector = statistic.ittSelector
    calculateAndMarkStatisticInHtmlInItt(html, npc, statistic, foundry.utils.getProperty(npc, statistic.property))
  }
  // Passive stealth and passive athletics
  for (const frontSkillName of ['stealth', 'athletics']) {
    if (game.settings.get('pf2e-token-hud', 'others') === 'none') continue
    const statistic = {
      name: 'Skill',
      type: 'skill',
      ittSelector: `A[data-slug="${frontSkillName}"]`,
      styleOptionUsed: 'primary',
    }
    statistic.selector = statistic.ittSelector
    calculateAndMarkStatisticInHtmlInItt(html, npc, statistic, getSkillProperty(npc, frontSkillName))
  }

  // Skills - in another sidebar
  // Attacks - in another sidebar
  // Weaknesses and Resistances - skipped
  // Spell attack and spell DC - skipped
}

const markStatisticsInNpcInteractiveTokenTooltipSkillsSidebar = (npc, html) => {
  for (const skillElem of html.find('DIV.skill    A[data-action="roll-skill"]')) {
    const longSlug = skillElem.dataset.slug
    const statistic = {
      name: 'Skill',
      type: 'skill',
      ittSelector: `DIV.skill    A[data-action="roll-skill"][data-slug="${longSlug}"]`,
      styleOptionUsed: 'primary',
    }
    statistic.selector = statistic.ittSelector
    calculateAndMarkStatisticInHtmlInItt(html, npc, statistic, getSkillProperty(npc, longSlug))
  }
}
const markStatisticsInNpcInteractiveTokenTooltipActionsSidebar = (npc, html) => {
  for (const strikeElem of html.find('DIV.strike.details')) {
    const actionIndex = parseInt(strikeElem.dataset.index)
    const attackBonus = npc.system.actions[actionIndex].item.system.bonus.value
    calculateAndMarkStatisticInHtmlInItt(html, npc, {
      name: 'Strike Attack Bonus',
      type: 'strike_attack',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `DIV.strike.details[data-index="${actionIndex}"]   DIV.variants    DIV[data-action="strike-attack"][data-index="0"]`,
      styleOptionUsed: 'secondary',
    }, attackBonus)
    const damageRolls = npc.system.actions[actionIndex].item.system.damageRolls
    const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData.damage), 0)
    if (avgTotalDamage === 0) {
      // no damage, e.g. web attack
      continue
    }
    if (avgTotalDamage < 0) {
      const actionName = npc.system.actions[actionIndex].item.name
      console.error(`failed parsing math expression for strike damage: actor ${npc.name}, attack ${actionName}`)
      continue
    }
    calculateAndMarkStatisticInHtmlInItt(html, npc, {
      name: 'Strike Damage',
      type: 'strike_damage',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `DIV.strike.details[data-index="${actionIndex}"]   DIV.variants    DIV[data-action="strike-damage"]`,
      styleOptionUsed: 'secondary',
    }, avgTotalDamage)
  }
}

const getSkillProperty = (npc, skillName) => {
  if (skillName === 'perception') // not actually a skill but still shown in that skills sidebar
    return foundry.utils.getProperty(npc, '_source.system.perception.mod')
  return foundry.utils.getProperty(npc, `skills.${skillName}.base`)
    // untrained will sadly be affected by some status effects (is not "base"/"source")
    || foundry.utils.getProperty(npc, `skills.${skillName}.modifiers.0.modifier`)
}

const calculateAndMarkStatisticInHtmlInItt = (html, npc, statistic, statisticValue) => {
  const ittIntegration = game.settings.get(MODULE_ID, 'pf2e-itt-integration')
  if (ittIntegration === 'disabled') return
  if (ittIntegration === 'color') statistic.styleOptionUsed = 'secondary'
  return calculateAndMarkStatisticInHtml(html, npc, statistic, statisticValue)
}

const colorLegend = () => {
  const isEnabled = game.settings.get(MODULE_ID, 'toggle-on')
  const useColors = game.settings.get(MODULE_ID, 'mark-with-colors')
  const useBorders = game.settings.get(MODULE_ID, 'mark-with-borders')
  const colorsClass = (scaleKeyWord) => useColors ? `${MODULE_ID}-${scaleKeyWord}-color-legend` : ''
  const bordersClass = (scaleKeyWord) => useBorders ? `${MODULE_ID}-${scaleKeyWord}-border-legend` : ''
  return `
    <div class="pf2e-see-simple-scale-statistics-colors-legend ${isEnabled ? 'active' : ''}">
      <div class="pf2e-see-simple-scale-statistics-color-in-legend 
        ${colorsClass('Terrible')}
        ${bordersClass('Terrible')}" 
      ></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend
        ${colorsClass('Low')}
        ${bordersClass('Low')}" 
      ></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend
        ${colorsClass('Moderate')}
        ${bordersClass('Moderate')}" 
      ></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend
        ${colorsClass('High')}
        ${bordersClass('High')}" 
      ></div>
      <div class="pf2e-see-simple-scale-statistics-color-in-legend
        ${colorsClass('Extreme')}
        ${bordersClass('Extreme')}" 
      ></div>
    </div>
  `
}

const addButtonToNpcSheet = (sheet, html) => {
  let isEnabled = game.settings.get(MODULE_ID, 'toggle-on')
  const maybeActive = isEnabled ? 'active' : ''
  const text = game.i18n.localize(`${MODULE_ID}.ToggleButton`)
  const newNode = `
<div class="pf2e-see-simple-scale-statistics-change-mode ${maybeActive}">
  <div>
    <a>${text}</a>
  </div>
  ${colorLegend()}
</div>
`
  const $adjustmentsElement = html.find('div.adjustments')
  if ($adjustmentsElement.length > 0) {
    html.find('div.adjustments > a.elite').before(newNode)
  } else {
    // e.g. for NPC sheets opened through compendium
    html.find('div.rarity-size').append(`
<div class="adjustments" style="flex: auto; justify-content: flex-end;">
${newNode}
</div>
`)
  }
  html.find('DIV.pf2e-see-simple-scale-statistics-change-mode > div > a').click(() => {
    isEnabled = !isEnabled
    game.settings.set(MODULE_ID, 'toggle-on', isEnabled)
    refreshLegend(html, isEnabled)
    markStatisticsInNpcSheet(sheet.object, html)
  })
}

const refreshLegend = (html, isEnabled) => {
  if (isEnabled) {
    html.find('DIV.pf2e-see-simple-scale-statistics-change-mode').addClass('active')
    html.find('DIV.pf2e-see-simple-scale-statistics-colors-legend').addClass('active')
  } else {
    html.find('DIV.pf2e-see-simple-scale-statistics-change-mode').removeClass('active')
    html.find('DIV.pf2e-see-simple-scale-statistics-colors-legend').removeClass('active')
  }
}

const registerSettings = () => {
  game.settings.register(MODULE_ID, 'toggle-on', {
    name: `Toggle on/off`,
    hint: `This can also be toggled directly within NPC sheets (top right corner).`,
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
  })
  game.settings.register(MODULE_ID, 'mark-with-colors', {
    name: `Mark with colors`,
    hint: `Red, orange, yellow, green, blue - to match Terrible, Low, Moderate, High, Extreme.`,
    scope: 'client',
    config: true,
    type: Boolean,
    default: true,
  })
  game.settings.register(MODULE_ID, 'mark-with-borders', {
    name: `Mark with borders`,
    hint: `Inset, Groove, Dotted, Dashed, Solid - to match Terrible, Low, Moderate, High, Extreme.`,
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
  })
  game.settings.register(MODULE_ID, 'pf2e-itt-integration', {
    name: `PF2e Interactive Token Tooltip integration`,
    hint: `Integration with the PF2eITT module.`,
    scope: 'client',
    config: true,
    type: String,
    choices: {
      'disabled': 'Disabled',
      'shadows': 'Colorize shadows around icons and text (if "Mark with colors" is enabled)',
      'color': `Colorize text, and possibly icons, and possibly borders`,
    },
    default: 'shadows',
  })
  game.settings.register(MODULE_ID, 'treat-broad-iwr-as-more-important', {
    name: `Treat broad weaknesses/resistances as higher`,
    hint: `E.g. will mark "resistance 5 to physical" as if it was "resistance 10 to bludgeoning" 
    (often High/Extreme instead of Low/Terrible).  This is an odd exception to include, but it helps identify
     when a creature is unusually resistant/weak, since these "broad" IWR are much more impactful and are always
      expected to have a low/terrible statistic.  Applies only to "physical" and "all".`,
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
  })
}

Hooks.once('init', () => {
  initializeTables()
  registerSettings()
  Hooks.on('renderActorSheetPF2e', (sheet, html, _) => {
    if (sheet.object.type !== 'npc') return
    addButtonToNpcSheet(sheet, html)
    markStatisticsInNpcSheet(sheet.object, html)
  })
  // integration - PF2E interactive token tooltip
  Hooks.on('renderHUD', (application, pf2eTokenHudHtml, _someActorData) => {
    if (!game.settings.get(MODULE_ID, 'toggle-on')
      || game.settings.get(MODULE_ID, 'pf2e-itt-integration') === 'disabled')
      return
    if (application.actor.type !== 'npc')
      return
    if (application.actor.permission < CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER)
      return
    markStatisticsInNpcInteractiveTokenTooltip(application.actor, pf2eTokenHudHtml)
  })
  Hooks.on('renderHUDSidebar', (sidebarType, pf2eTokenHudHtml, application) => {
    if (!game.settings.get(MODULE_ID, 'toggle-on')
      || game.settings.get(MODULE_ID, 'pf2e-itt-integration') === 'disabled')
      return
    if (application.actor.type !== 'npc')
      return
    if (sidebarType === 'skills')
      markStatisticsInNpcInteractiveTokenTooltipSkillsSidebar(application.actor, pf2eTokenHudHtml)
    if (sidebarType === 'actions')
      markStatisticsInNpcInteractiveTokenTooltipActionsSidebar(application.actor, pf2eTokenHudHtml)
  })
  console.log(`${MODULE_ID}: Initialized`)
})
