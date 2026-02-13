import { initializeTables, TABLES } from './statistics_tables.js'
import { shemetzConsoleCode } from './error-checking-console-scripts.js'

const MODULE_ID = 'pf2e-see-simple-scale-statistics'

const { getProperty } = foundry.utils

const localize = (keyStartingWithDot) => game.i18n.localize(`${MODULE_ID}${keyStartingWithDot}`)

const isCloserToMiddle = (key1, key2) => {
  if (key1 === 'Moderate') return true
  if (key2 === 'Moderate') return false
  return key1 === 'Low' || key1 === 'High'
}

const getMainNpcStatistics = () => {
  return [
    {
      name: 'AC',
      translatedName: localize('.StatisticTooltip.StatisticType.ac'),
      id: 'ac',
      type: 'ac',
      property: '_source.system.attributes.ac.value',
      selector: 'input[data-property="system.attributes.ac.value"]',
      ittSelector: 'div[data-section="ac"]',
      styleOptionUsed: 'primary',
      positiveHasPlus: false,
    },
    {
      name: 'HP',
      translatedName: localize('.StatisticTooltip.StatisticType.hp'),
      id: 'hp',
      type: 'hp',
      property: '_source.system.attributes.hp.max',
      selector: 'input[data-property="system.attributes.hp.max"]',
      ittSelector: 'div[data-section="hp"]',
      styleOptionUsed: 'primary',
      positiveHasPlus: false,
    },
    {
      name: 'Perception',
      translatedName: localize('.StatisticTooltip.StatisticType.perception'),
      id: 'perception',
      type: 'perception',
      property: '_source.system.perception.mod',
      selector: 'input[data-property="system.perception.mod"]',
      ittSelector: 'a[data-slug="perception"]',
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Fortitude',
      translatedName: localize('.StatisticTooltip.StatisticType.fortitude'),
      id: 'fortitude',
      type: 'save',
      property: '_source.system.saves.fortitude.value',
      selector: 'input[data-property="system.saves.fortitude.value"]',
      ittSelector: 'a[data-save="fortitude"]',
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Reflex',
      translatedName: localize('.StatisticTooltip.StatisticType.reflex'),
      id: 'reflex',
      type: 'save',
      property: '_source.system.saves.reflex.value',
      selector: 'input[data-property="system.saves.reflex.value"]',
      ittSelector: 'a[data-save="reflex"]',
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Will',
      translatedName: localize('.StatisticTooltip.StatisticType.will'),
      id: 'will',
      type: 'save',
      property: '_source.system.saves.will.value',
      selector: 'input[data-property="system.saves.will.value"]',
      ittSelector: 'a[data-save="will"]',
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Strength',
      translatedName: localize('.StatisticTooltip.StatisticType.str'),
      id: 'str',
      type: 'ability',
      property: '_source.system.abilities.str.mod',
      selector: 'input[data-property="system.abilities.str.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Dexterity',
      translatedName: localize('.StatisticTooltip.StatisticType.dex'),
      id: 'dex',
      type: 'ability',
      property: '_source.system.abilities.dex.mod',
      selector: 'input[data-property="system.abilities.dex.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Constitution',
      translatedName: localize('.StatisticTooltip.StatisticType.con'),
      id: 'con',
      type: 'ability',
      property: '_source.system.abilities.con.mod',
      selector: 'input[data-property="system.abilities.con.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Intelligence',
      translatedName: localize('.StatisticTooltip.StatisticType.int'),
      id: 'int',
      type: 'ability',
      property: '_source.system.abilities.int.mod',
      selector: 'input[data-property="system.abilities.int.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Wisdom',
      translatedName: localize('.StatisticTooltip.StatisticType.wis'),
      id: 'wis',
      type: 'ability',
      property: '_source.system.abilities.wis.mod',
      selector: 'input[data-property="system.abilities.wis.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
    {
      name: 'Charisma',
      translatedName: localize('.StatisticTooltip.StatisticType.cha'),
      id: 'cha',
      type: 'ability',
      property: '_source.system.abilities.cha.mod',
      selector: 'input[data-property="system.abilities.cha.mod"]',
      ittSelector: undefined,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    },
  ]
}

const getMainNpcStatisticsForSimpleSheetNpc = () => {
  return getMainNpcStatistics().filter(s => ['HP', 'Perception', 'Will'].includes(s.name))
}

const TABLE_OF_TYPE = {
  ac: TABLES.AC,
  hp: TABLES.HP,
  hp_range: TABLES.HP_RANGE,
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
  strike_damage_range: TABLES.STRIKE_DAMAGE_RANGE,
}

const getScaleNumbers = (statisticType, level) => {
  if (level >= 25 || level <= -2) {
    // stats are off the charts.  we'll do the best we can by treating this as level 24 or level -1.
    // (this comes up with the Tarrasque, level 25 creature)
    level = Math.max(-1, Math.min(24, level))
  }
  return TABLE_OF_TYPE[statisticType][level]
}

const calcScale = (baseValue, level, statisticType) => {
  const referenceValues = getScaleNumbers(statisticType, level)
  // using the relevant scale, picking the value that is closest to the base value
  let closestKey = null
  let closestDiff = null
  let closestDelta = 0
  for (const [key, value] of Object.entries(referenceValues)) {
    if (value === null) continue
    const delta = baseValue - value
    const diff = Math.abs(delta)
    if (closestDiff === null || diff < closestDiff
      // tiebreaking towards middle - e.g. if +15 is High and +13 is Moderate, a +14 will count as Moderate
      || (diff === closestDiff && isCloserToMiddle(key, closestKey))) {
      closestKey = key
      closestDiff = diff
      closestDelta = delta
    }
  }

  return {
    closestKey,
    closestDelta,
    referenceValue: referenceValues[closestKey],
  }
}

const getSimpleScale = (baseValue, level, statisticType) => calcScale(baseValue, level, statisticType).closestKey

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
  const npcLevel =
    // if stats are off the charts, we'll do the best we can by treating this as level 24 or level -1.
    // (this comes up with the Tarrasque, level 25 creature)
    Math.max(-1, Math.min(24, npc.level))
  const {
    closestKey: scaleKeyword,
    closestDelta,
    referenceValue,
  } = calcScale(statisticValue, npc.level, statistic.type)
  const addOrRemoveClass = (isEnabled ? foundSelector.addClass : foundSelector.removeClass).bind(foundSelector)
  addOrRemoveClass('pf2e-ssss')
  if (useColors) {
    addOrRemoveClass(`${MODULE_ID}-${scaleKeyword}-color-${statistic.styleOptionUsed}`)
  }
  if (useBorders) {
    addOrRemoveClass(`${MODULE_ID}-${scaleKeyword}-border-${statistic.styleOptionUsed}`)
  }
  if (isEnabled) {
    let table = TABLE_OF_TYPE[statistic.type]
    if (statistic.type === 'strike_damage') {
      table = TABLE_OF_TYPE['strike_damage_range']
    } else if (statistic.type === 'hp') {
      table = TABLE_OF_TYPE['hp_range']
    }
    let rows = [
      [npcLevel - 1, table[npcLevel - 1]],
      [npcLevel, table[npcLevel]],
      [npcLevel + 1, table[npcLevel + 1]],
    ].filter(r => r[1] !== undefined)
    let tooltipText
    if (closestDelta > 0)
      tooltipText = localize('.StatisticTooltip.v_n_is_considered_sw_d_above_rv')
    if (closestDelta < 0)
      tooltipText = localize('.StatisticTooltip.v_n_is_considered_sw_d_below_rv')
    if (closestDelta === 0)
      tooltipText = localize('.StatisticTooltip.v_n_is_considered_exactly_sw')
    tooltipText += '<table class="pf2e-see-simple-scale-statistics-tooltip-table">'
    tooltipText += '<tr>'
    tooltipText += `<th></th>`
    const scaleKeywords = Object.keys(rows[0][1])
    for (const key of scaleKeywords) {
      const cellClassName = (key === scaleKeyword) ? ' highlighted' : ''
      tooltipText += `<th class="${cellClassName}">${localize(`.ScaleWord.${key}`)}</th>`
    }
    tooltipText += '</tr>'
    for (const [level, row] of rows) {
      let rowClassName = level !== npcLevel ? ' different-level' : ''
      tooltipText += `<tr class="${rowClassName}">`
      const firstCellClassName = (level === npcLevel) ? ' highlighted' : ''
      tooltipText += `<td class="${firstCellClassName}">${game.i18n.localize('PF2E.LevelLabel')} ${level}</td>`
      for (const key of scaleKeywords) {
        const cellClassName = (level === npcLevel && key === scaleKeyword) ? ' highlighted' : ''
        tooltipText += `<td class="${cellClassName}">${row[key]}</td>`
      }
      tooltipText += '</tr>'
    }
    tooltipText += `</table>`
    tooltipText = tooltipText
      .replace('{value}', statistic.positiveHasPlus ? `+${statisticValue}` : statisticValue)
      .replace('{name}', statistic.translatedName)
      .replace('{scaleWord}', localize(`.ScaleWord.${scaleKeyword}`))
      .replace('{delta}', Math.abs(closestDelta))
      .replace('{referenceValue}', referenceValue)

    const target = foundSelector[0]
    // this workaround is a little hacky, but it works well enough
    setTimeout(() => {
      target.dataset.tooltipHtml = tooltipText
      target.dataset.tooltipClass = 'pf2e-see-simple-scale-statistics-scale-tooltip'
    }, 100)
  }
}

/**
 * How much is persistent damage worth, compared to normal damage?
 * - Convergence (total over infinity rounds) says 3.333
 * - non-stackability says 0.0001
 * - https://www.reddit.com/r/Pathfinder2e/comments/1e7578f/live_wire_new_cantrip_calculations_and_comparisons/ says 1.5 or 1.7
 * - what if we compare different level 1 bombs?  (ignoring splash)
 *   - acid flask is 1 direct, 1d6 (3.5) persistent
 *   - alchemist's fire is 1d8 (4.5) direct, 1 persistent
 *   - blight bomb is 1d4 (2.5) direct, 1d4 (2.5) persistent
 *   - if we value persistent as 1:  they are worth 4.5, 5.5, 5
 *   - if we value persistent as 1.5: they are worth 6.25, 6, 6.25
 *   - if we value persistent as 2: they are worth 8, 6.5, 7.5
 *   - 1.5 sounds good
 *   - this is still true for higher level bombs, e.g. at level 17 with 1.5 PDC they're worth:  22, 24, 25
 */
const PERSISTENT_DAMAGE_COEFFICIENT = 1.5
/**
 * For Splash... IDK, but 2 feels right, it
 */
const SPLASH_DAMAGE_COEFFICIENT = 2
// TODO - include passive damage increases in this, e.g. the Azer's +1d6.
// I know it's possible via calling `action.damage({getFormula: true}), but that's an async function and it returns a
// string that requires parsing, and I am really not looking forward to working with that, so maybe I never will
const calcAvgDamage = (damageObj) => {
  const damageText = damageObj.damage
  // a bit hacky
  const damageWithMultiplication = damageText.replace(
    /(\d+)d(\d+)/,
    (all, dCount, dNum) => `${dCount}/2*(${dNum}+1)`,
  )
  const isMathExpression = /^[\s\d-+*/.()_]*$/.test(damageWithMultiplication)
  if (!isMathExpression) return -99999
  // eval is evil, but we did make sure it's a math expression
  let avgValue = eval(damageWithMultiplication)
  if (damageObj.category === 'persistent') {
    // persistent damage is valued at 1.5x
    avgValue *= PERSISTENT_DAMAGE_COEFFICIENT
  }
  if (damageObj.category === 'splash') {
    // splash damage is valued at 2x
    avgValue *= SPLASH_DAMAGE_COEFFICIENT
  }
  return avgValue
}

/**
 * I chose to double the value of "wide" resistances, even though it's technically misleading.  The system rules suggest using Low for
 * these wide resistances and High for narrow resistances, for balance reasons.  However, GMs who use SSSS are probably trying to
 * either quickly see a creature's most important attributes at a glance, or to build a creature.  That makes it confusing
 * when seeing a number marked as Low even though having a wide resistance is actually a big power-up.
 *
 * TODO this is probably confusing with the tooltip now showing a doubled number!  find time to improve this if you can think of an easy refactor
 */
const artificiallyInflateIfVeryCommonType = (resistanceOrWeaknessData) => {
  const typeName = resistanceOrWeaknessData.type
  if (['physical', 'all-damage'].includes(typeName) &&
    game.settings.get(MODULE_ID, 'treat-broad-iwr-as-more-important')) {
    return 2
  }
  return 1
}

const markStatisticsInNpcSheet = (npc, html, template) => {
  const isSimpleSheet = template === 'systems/pf2e/templates/actors/npc/simple-sheet.hbs'
    || template === 'systems/sf2e/templates/actors/npc/simple-sheet.hbs'
  if (isSimpleSheet) {
    for (const statistic of getMainNpcStatisticsForSimpleSheetNpc()) {
      calculateAndMarkStatisticInHtml(html, npc, statistic, getProperty(npc, statistic.property))
    }
    return
  }
  if (npc.attributes.adjustment === 'elite' || npc.attributes.adjustment === 'weak') {
    // won't touch Elite/Weak sheets, we don't know how to easily take this into account
    return
  }

  // HP, AC, Perception, Saves, and Ability mods - all easy to access and set
  for (const statistic of getMainNpcStatistics()) {
    calculateAndMarkStatisticInHtml(html, npc, statistic, getProperty(npc, statistic.property))
  }

  // Skills
  for (const skillElem of html.find('DIV.skills.section-container   DIV.list   DIV.skill-entry')) {
    const longSlug = skillElem.dataset.statistic
    const statistic = {
      name: `Skill: ${longSlug}`,
      translatedName: localize('.StatisticTooltip.StatisticType.skill'),
      type: 'skill',
      selector: `DIV.skills.section-container   DIV.list   DIV[data-statistic="${longSlug}"]   a`,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
    }
    // `base` will not be undefined for anything that is visibly there
    const skillValue = getSkillProperty(npc, longSlug)
    calculateAndMarkStatisticInHtml(html, npc, statistic, skillValue)
  }

  // Weaknesses and Resistances
  html.find('li[data-weakness]').each((index, $el) => {
    const statistic = {
      name: 'Weakness',
      translatedName: localize('.StatisticTooltip.StatisticType.weakness'),
      type: 'weaknesses',
      selector: `li[data-weakness]:nth(${index})`,
      styleOptionUsed: 'primary',
      positiveHasPlus: false,
    }
    const weaknessType = $el.dataset['weakness'] // e.g. "acid"
    // note that weaknesses are flipped - so that a high weakness is colored as "low" (because it's a negative).
    // they are already flipped in the statistics tables, but this comment is here to remind you of this.
    const weaknessData = getProperty(npc, `system.attributes.weaknesses`).find(w => w.type === weaknessType)
    const weaknessValue = weaknessData.value * artificiallyInflateIfVeryCommonType(weaknessData)
    calculateAndMarkStatisticInHtml(html, npc, statistic, weaknessValue)
  })
  html.find('li[data-resistance]').each((index, $el) => {
    const statistic = {
      name: 'Resistance',
      translatedName: localize('.StatisticTooltip.StatisticType.resistance'),
      type: 'resistances',
      selector: `li[data-resistance]:nth(${index})`,
      styleOptionUsed: 'primary',
      positiveHasPlus: false,
    }
    const resistanceType = $el.dataset['resistance'] // e.g. "acid"
    const resistanceData = getProperty(npc, `system.attributes.resistances`).find(w => w.type === resistanceType)
    const resistanceValue = resistanceData.value * artificiallyInflateIfVeryCommonType(resistanceData)
    calculateAndMarkStatisticInHtml(html, npc, statistic, resistanceValue)
  })

  // Attacks/Strikes (marking both attack bonus and damage dice/numbers)
  for (const attackElem of html.find('OL.strikes-list   LI.item.action')) {
    const actionIndex = parseInt(attackElem.dataset.actionIndex)
    const attackBonus = npc.system.actions[actionIndex].item.system.bonus.value
    calculateAndMarkStatisticInHtml(html, npc, {
      name: 'Strike Attack Bonus',
      translatedName: localize('.StatisticTooltip.StatisticType.strike_attack'),
      type: 'strike_attack',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.strikes-list   LI.item.action[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-attack"][data-variant-index="0"]`,
      styleOptionUsed: 'secondary',
      positiveHasPlus: true,
    }, attackBonus)
    const damageRolls = npc.system.actions[actionIndex].item.system.damageRolls
    const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData), 0)
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
      translatedName: localize('.StatisticTooltip.StatisticType.strike_damage'),
      type: 'strike_damage',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `OL.strikes-list   LI.item.action[data-action-index="${actionIndex}"]   BUTTON[data-action="strike-damage"]`,
      styleOptionUsed: 'secondary',
      positiveHasPlus: false,
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
      translatedName: localize('.StatisticTooltip.StatisticType.spell_attack'),
      type: 'spell_attack',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellAttack   label`,
      styleOptionUsed: 'secondary',
      positiveHasPlus: true,
    }, spellAttack)
    calculateAndMarkStatisticInHtml(html, npc, {
      name: 'Spell DC',
      translatedName: localize('.StatisticTooltip.StatisticType.spell_dc'),
      type: 'spell_dc',
      selector: `DIV.tab.spells   LI.spellcasting-entry[data-item-id="${spellcastingItemId}"]   DIV.spellDC   label`,
      styleOptionUsed: 'secondary',
      positiveHasPlus: false,
    }, spellDc)
  }
}

const judgeNpcStatisticsByGuidelines = (npc, template) => {
  if (
    npc.system.saves.fortitude.value === 0
    && npc.system.saves.reflex.value === 0
    && npc.system.saves.will.value === 0
  ) {
    // this actor has just been created, ignore it
    return []
  }
  const isSimpleSheet = template === 'systems/pf2e/templates/actors/npc/simple-sheet.hbs'
    || template === 'systems/sf2e/templates/actors/npc/simple-sheet.hbs'
  if (isSimpleSheet) {
    return []
  }
  if (npc.attributes.adjustment === 'elite' || npc.attributes.adjustment === 'weak') {
    // won't touch Elite/Weak sheets, we don't know how to easily take this into account
    return []
  }
  let level = npc.level
  if (level >= 25 || level <= -2) {
    // stats are off the charts.  we'll do the best we can by treating this as level 24 or level -1.
    // (this comes up with the Tarrasque, level 25 creature)
    level = Math.max(-1, Math.min(24, level))
  }
  const mode = game.settings.get(MODULE_ID, 'warnings-mode')
  const warnings = []
  const summarizedStatistics = {
    hp: null,
    ac: null,
    perception: null,
    fortitude: null,
    reflex: null,
    will: null,
    str: null,
    dex: null,
    con: null,
    int: null,
    wis: null,
    cha: null,
    attack1: null,
    attack2: null,
    attack3: null,
    attack4: null,
    attack5: null,
    attack6: null,
    attack7: null,
    attack8: null,
    damage1: null,
    damage2: null,
    damage3: null,
    damage4: null,
    damage5: null,
    damage6: null,
    damage7: null,
    damage8: null,
    spellAttack: null,
    spellDc: null,
  }
  let hasBroadResistance = false
  // HP, AC, Perception, Saves, and Ability mods
  for (const statistic of getMainNpcStatistics()) {
    const value = getProperty(npc, statistic.property)
    const scale = getSimpleScale(value, level, statistic.type)
    summarizedStatistics[statistic.id] = scale
    const table = getScaleNumbers(statistic.type, level)

    if (['ac', 'perception', 'fortitude', 'reflex', 'will'].includes(statistic.id)) {
      // arbitrarily, I decided that "3 above extreme" is too much
      // if we go with 2 we have a lot more, about 0.5% of total NPCs,
      // - for ac e.g. Seldeg's Steed
      // - for fortitude e.g. Delight Archdragon, Oliphaunt of Jandelay
      // - for perception e.g. Norn
      // - for will e.g. Prime Minister and a few other such creatures with a high "social encounter level"
      if (scale === 'Extreme' && value >= table['Extreme'] + 3) {
        warnings.push({
          id: `higher-than-extreme-${statistic.id}`,
          directText: `This creature's ${statistic.name} is much above Extreme (${value} > ${table['Extreme']})`,
          reasoningQuote: 'This value is outside the bounds given in the Building Creatures rules.',
          percentThatFailThis: '0.2%',
        })
      }
      // e.g Sargassum Heap, Zombie Mammoth, Inkdrop
      // e.g Ilgreth (mistake that requires errata), Ravenile Rager (mistake?), Necromancer Troop (mistake?)
      // e.g. Cyclops Zombie, Skeletal Knight
      // e.g. Living Statue, Storied Harrowkin, Larval Cave Worm Brood
      if (scale === 'Terrible' && value <= table['Terrible'] - 2
        // (except ooze ac and reflex which are often way below terrible)
        && !(npc.system.traits.value.includes('ooze') && ['ac', 'reflex'].includes(statistic.id))) {
        warnings.push({
          id: `lower-than-terrible-${statistic.id}`,
          directText: `This creature's ${statistic.name} is much below Terrible (${value} < ${table['Terrible']})`,
          reasoningQuote: 'This value is outside the bounds given in the Building Creatures rules.',
          percentThatFailThis: '1.5%',
        })
      }
    }
  }
  for (const resistance of npc.system.attributes.resistances) {
    if (['physical', 'all-damage'].includes(resistance.type)) {
      const scale = getSimpleScale(resistance.value * 2, level, 'resistances')
      if (scale !== 'Terrible') {
        hasBroadResistance = true
      }
    }
  }
  // Strikes
  for (const action of npc.system.actions) {
    if (action.type !== 'strike') continue
    const strike = action.item
    const attackBonus = strike.system.bonus.value
    const damageRolls = strike.system.damageRolls
    const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData), 0)
    if (avgTotalDamage === 0) {
      // no damage, e.g. web attack
      continue
    }
    if (avgTotalDamage < 0) {
      const actionName = strike.name
      console.error(`failed parsing math expression for strike damage: actor ${npc.name}, attack ${actionName}`)
      continue
    }
    const attackScale = getSimpleScale(attackBonus, level, 'strike_attack')
    const damageScale = getSimpleScale(avgTotalDamage, level, 'strike_damage')
    for (const num of [1, 2, 3, 4, 5, 6, 7, 8]) {
      if (summarizedStatistics[`attack${num}`] === null) {
        summarizedStatistics[`attack${num}`] = attackScale
        summarizedStatistics[`damage${num}`] = damageScale
      }
    }
    const attackTable = getScaleNumbers('strike_attack', level)
    // arbitrarily, I decided that "2 above extreme" is too much for attacks
    // e.g. Promise Guard, Zorek, Charn Scarnetti (likely mistake), Tehialai (likely mistake)
    if (attackScale === 'Extreme' && attackBonus >= attackTable['Extreme'] + 2) {
      warnings.push({
        id: `higher-than-extreme-attack`,
        directText: `This creature's attack "${strike.name}" is much above Extreme (${attackBonus} > ${attackTable['Extreme']})`,
        reasoningQuote: 'This value is outside the bounds given in the Building Creatures rules.',
        percentThatFailThis: '0.1%',
      })
    }
    // arbitrarily, I decided that "5 below terrible" is too little for attacks
    // e.g. Kraken Caller
    if (attackScale === 'Terrible' && attackBonus <= attackTable['Terrible'] - 5) {
      warnings.push({
        id: `lower-than-terrible-attack`,
        directText: `This creature's attack "${strike.name}" is much below Terrible (${attackBonus} < ${attackTable['Terrible']})`,
        reasoningQuote: 'This value is outside the bounds given in the Building Creatures rules.',
        percentThatFailThis: '0.1%',
      })
    }
  }
  // Spell attack and spell DC
  for (const spellcasting of npc.spellcasting.contents) {
    if (spellcasting.system?.spelldc === undefined) continue  // skipping "rituals" which is a spellcasting section
    summarizedStatistics.spellAttack = getSimpleScale(spellcasting.system.spelldc.value, level, 'spell_attack')
    summarizedStatistics.spellDc = getSimpleScale(spellcasting.system.spelldc.dc, level, 'spell_dc')
  }
  const traits = npc.system.traits.value
  const weaknesses = npc.system.attributes.weaknesses.map(w => w.type)
  const resistances = npc.system.attributes.resistances.map(r => r.type)
  const immunities = npc.system.attributes.immunities.map(i => i.type)

  // Warning checks now!
  /*
  This section is heavily based on https://2e.aonprd.com/Rules.aspx?ID=2874
  and also on my own statistical analysis, with the goal of having each warning here apply to no more
  than 5% of all NPCs in my database, under the assumption that most NPCs are "built right".
   */

  const warnIfMissingTrait = (traitWith, traitWithout, pctFailing) => {
    if (traits.includes(traitWith) && !traits.includes(traitWithout)) {
      let addition = ''
      if (traitWithout.includes('holy') && !npc.system.details.publication.remaster) {
        if (mode === 'atheist') return
        addition = ' This pre-Remaster creature should have the trait added now!'
      }
      warnings.push({
        id: `missing-trait-${traitWithout}`,
        directText: `This creature does not have the ${traitWithout} trait`,
        reasoningQuote: `Creatures with the ${traitWith} trait always have the ${traitWithout} trait.` + addition,
        percentThatFailThis: pctFailing,
      })
    }
  }
  const warnIfMissingWeakness = (traitWith, weaknessWithout, pctFailing) => {
    if (traits.includes(traitWith) && !weaknesses.includes(weaknessWithout)
      // also consider "resist all except X" as weakness to X
      && !npc.system.attributes.resistances.some(r => r.exceptions.includes(weaknessWithout))) {
      let addition = ''
      if (weaknessWithout.includes('holy') && !npc.system.details.publication.remaster) {
        if (mode === 'atheist') return
        addition = ' This pre-Remaster creature should have the weakness added now!'
      }
      warnings.push({
        id: `missing-weakness-${weaknessWithout}`,
        directText: `This creature does not have a weakness to ${weaknessWithout}`,
        reasoningQuote: `Creatures with the ${traitWith} trait tend to have weakness to ${weaknessWithout}.` + addition,
        percentThatFailThis: pctFailing,
      })
    }
  }
  const warnIfMissingResistance = (traitWith, resistanceWithout, pctFailing) => {
    // (if it has an immunity instead of a resistance, that's fine, won't warn.  e.g. Haunted Nosoi)
    if (traits.includes(traitWith) && !resistances.includes(resistanceWithout) && !immunities.includes(resistanceWithout)) {
      warnings.push({
        id: `missing-resistance-${resistanceWithout}`,
        directText: `This creature does not have a resistance to ${resistanceWithout}`,
        reasoningQuote: `Creatures with the ${traitWith} trait tend to have resistance to ${resistanceWithout}.`,
        percentThatFailThis: pctFailing,
      })
    }
  }
  const warnIfMissingImmunity = (traitWith, immunityWithout, pctFailing) => {
    if (traits.includes(traitWith) && !immunities.includes(immunityWithout)) {
      warnings.push({
        id: `missing-immunity-${immunityWithout}`,
        directText: `This creature does not have a immunity to ${immunityWithout}`,
        reasoningQuote: `Creatures with the ${traitWith} trait tend to have immunity to ${immunityWithout}.`,
        percentThatFailThis: pctFailing,
      })
    }
  }
  const warnIfMissingImmunityOrResistance = (traitWith, immunityWithout, pctFailing) => {
    if (traits.includes(traitWith) && !immunities.includes(immunityWithout) && !resistances.includes(immunityWithout)) {
      warnings.push({
        id: `missing-imm-or-res-${immunityWithout}`,
        directText: `This creature does not have a immunity or resistance to ${immunityWithout}`,
        reasoningQuote: `Creatures with the ${traitWith} trait tend to have immunity or resistance to ${immunityWithout}.`,
        percentThatFailThis: pctFailing,
      })
    }
  }

  warnIfMissingTrait('aeon', 'monitor', '9%')
  warnIfMissingTrait('angel', 'celestial', '0%')
  warnIfMissingTrait('angel', 'holy', '14%')
  warnIfMissingTrait('archon', 'celestial', '0%')
  warnIfMissingTrait('archon', 'holy', '0%')
  warnIfMissingImmunityOrResistance('archon', 'fear', '33%') // e.g. Lantern Archon.  but Monster Core 2 or 3 will probably fix them
  warnIfMissingTrait('azata', 'celestial', '0%')
  warnIfMissingTrait('azata', 'holy', '0%')
  warnIfMissingWeakness('azata', 'cold-iron', '0%')
  warnIfMissingTrait('celestial', 'holy', '12%')
  warnIfMissingWeakness('celestial', 'unholy', '0%')
  warnIfMissingImmunityOrResistance('cold', 'cold', '4%') // e.g. Blackfrost Guecubu, Jurgrindor
  warnIfMissingTrait('drift', 'cosmic', '0%')
  warnIfMissingTrait('daemon', 'fiend', '0%')
  warnIfMissingTrait('daemon', 'unholy', '0%')
  warnIfMissingImmunity('daemon', 'death-effects', '0%')
  warnIfMissingTrait('demon', 'fiend', '0%')
  warnIfMissingTrait('demon', 'unholy', '2%')
  warnIfMissingWeakness('demon', 'cold-iron', '6%')
  warnIfMissingTrait('devil', 'fiend', '0%')
  warnIfMissingTrait('devil', 'unholy', '2%')
  warnIfMissingWeakness('devil', 'holy', '2%')
  warnIfMissingImmunity('devil', 'fire', '4%')
  //disabled:  e.g. Uthul, Zaramuun, Young Brine Dragon, Muurfeli, Ararda, Jaathoom...
  //warnIfMissingImmunity("elemental", "bleed", "30%")
  //warnIfMissingImmunity("elemental", "paralyzed", "30%")
  //warnIfMissingImmunity("elemental", "poison", "30%")
  //warnIfMissingImmunity("elemental", "sleep", "30%")
  warnIfMissingWeakness('fey', 'cold-iron', '21%') // e.g. Unicorn, Leprechaun, Grodair, Sprigjack...
  warnIfMissingTrait('fiend', 'unholy', '2%')
  warnIfMissingWeakness('fiend', 'holy', '20%') // e.g. Penqual, Shadow Yai, Hell Hound, Nightmare, Ostovite
  warnIfMissingImmunityOrResistance('fire', 'fire', '2%')
  // Oozes usually have terrible AC
  if (traits.includes('ooze')) {
    if (summarizedStatistics.ac !== 'Terrible') {
      // e.g. Omox Slime Pool
      warnings.push({
        id: 'ooze-ac-not-terrible',
        directText: `This ooze has AC that isn't terrible! (terrible would be ${TABLES.AC[level]['Terrible']}).`,
        reasoningQuote: 'Oozes usually have terrible AC.',
        percentThatFailThis: '8%',
      })
    }
  }
  warnIfMissingTrait('protean', 'monitor', '0%')
  warnIfMissingResistance('protean', 'precision', '0%')
  warnIfMissingTrait('psychopomp', 'monitor', '0%')
  warnIfMissingImmunity('psychopomp', 'death-effects', '0%')
  warnIfMissingImmunity('psychopomp', 'disease', '0%')
  warnIfMissingResistance('psychopomp', 'poison', '0%')
  warnIfMissingResistance('psychopomp', 'void', '0%')
  warnIfMissingTrait('spectra', 'cosmic', '0%')
  warnIfMissingTrait('spectra', 'specter', '0%')
  warnIfMissingImmunity('swarm', 'precision', '5%') // e.g. Penqual, Glitterspore
  // Swarms usually have low HP
  if (traits.includes('swarm')) {
    if (summarizedStatistics.hp !== 'Moderate' && summarizedStatistics.hp !== 'Low' && summarizedStatistics.hp !==
      'Terrible') {
      // e.g. Bone Skipper Swarm, Orchid Mantis Swarm
      warnings.push({
        id: 'swarm-hp-not-low',
        directText: `This creature has HP that isn't low! (low would be ${TABLES.HP[level]['Low']}).`,
        reasoningQuote: 'Swarm creatures typically have low HP.',
        percentThatFailThis: '8%',
      })
    }
  }
  // "Almost all undead are unholy"
  // (15% are missing it, but most of them are pre-remaster, so I'm not counting those)
  // e.g. Revenant, Festrog, Draugr
  warnIfMissingTrait('undead', 'unholy', '5%')
  //Wood
  //Weaknesses fire and axes or slashing
  if (traits.includes('wood')
    && !weaknesses.includes('fire') && !weaknesses.includes('slashing')
    && !traits.includes('fire') && !traits.includes('incorporeal') && !traits.includes('dragon')
  ) {
    warnings.push({
      id: `missing-wood-weaknesses`,
      directText: `This creature does not have a weakness to fire, slashing, or axes`,
      reasoningQuote: `Creatures with the wood trait tend to have weakness to fire and axes or slashing.`,
      percentThatFailThis: '2%',
    })
  }

  const mainValues = Object.entries(summarizedStatistics).filter(([k, v]) => v !== null
    && ['ac', 'hp', 'fortitude', 'reflex', 'will', 'attack1', 'damage1', 'attack2', 'damage2', 'attack3', 'damage3', 'spellAttack', 'spellDc'].includes(k),
  ).map(([, v]) => v)
  const defenseValues = Object.entries(summarizedStatistics).filter(([k, v]) => v !== null && ['ac', 'fortitude', 'reflex', 'will'].includes(k)).map(([, v]) => v)
  const saveValues = Object.entries(summarizedStatistics).filter(([k, v]) => v !== null && ['fortitude', 'reflex', 'will'].includes(k)).map(([, v]) => v)

  // > Just about all creatures have at least one high value
  // > If you've made a creature that has four high stats and nothing low, or vice-versa, take another look.
  // e.g. Ghastly Bear, Clockwork Brewer, Harrow Doll
  if (
    !mainValues.some(stat => stat === 'High' || stat === 'Extreme') &&
    mainValues.some(stat => stat === 'Low' || stat === 'Terrible')
  ) {
    warnings.push(
      {
        id: 'no-high-statistics-at-least-one-low',
        directText: 'This creature has no high statistics at all (but at least one low).',
        reasoningQuote: 'Just about all creatures have at least one high value.',
        percentThatFailThis: '3%',
      },
    )
  }
  // > Most creatures should have at least one low statistic
  // > If you've made a creature that has four high stats and nothing low, or vice-versa, take another look.
  // e.g. Veksciralenix, Smiler, Bebilith, Kelpie, Werebear, Phoenix, Shikigami, Owb, Jorogumo
  if (!mainValues.some(stat => stat === 'Low' || stat === 'Terrible')) {
    warnings.push(
      {
        id: 'no-low-statistics-at-all',
        directText: 'This creature has no low statistics at all.',
        reasoningQuote: 'Most creatures should have at least one low statistic.',
        percentThatFailThis: '10%',
      },
    )
  }
  // > Statistics should be balanced overall. That means if you're giving a creature an extreme statistic, it should have some low or terrible statistics to compensate.
  // > At higher levels, give each creature more extreme statistics. Having one extreme statistic becomes typical around 11th level. A creature of 15th level or higher typically has two extreme statistics, and one of 20th level or higher should have three or four.
  // e.g. Tenome, Smaranava, Elasmosaurus, Orc Hunter
  if (level > 1 && level < 10 && mainValues.includes('Extreme') && !mainValues.includes('Terrible') &&
    mainValues.filter(v => v === 'Low').length < 2) {
    warnings.push(
      {
        id: 'extreme-statistic-without-low',
        directText: 'This creature has an extreme statistic, but no terrible statistics and few low ones.',
        reasoningQuote: 'Statistics should be balanced overall. That means if you\'re giving a creature an extreme statistic, it should have some low or terrible statistics to compensate. (unless it\'s high-level)',
        percentThatFailThis: '5%',
      },
    )
  }
  // > Almost no creature has great defenses in all areas, and such creatures often result in frustrating fights.
  // e.g. Abbot Tsujon, Lesser Death, Aiudara Wraith, Sovereign Archdragon
  if (defenseValues.filter(v => v === 'High' || v === 'Extreme').length >= 4) {
    warnings.push(
      {
        id: 'all-high-defenses',
        directText: `All four of this creature's defenses are high (AC > ${TABLES.AC[level]['Moderate']}, saves > ${TABLES.SAVES[level]['Moderate']}).`,
        reasoningQuote: 'Almost no creature has great defenses in all areas, and such creatures often result in frustrating fights.',
        percentThatFailThis: '0.3%',
      },
    )
  }
  // > Creatures with an extreme AC at lower levels can make for frustrating foes that require exceptionally high rolls to hit
  // e.g. Mister Beak, Champion of Rovagug, Reefclaw, Quickling, Vanara Disciple
  if (level <= 5 && summarizedStatistics.ac === 'Extreme') {
    warnings.push(
      {
        id: 'extreme-ac-at-low-level',
        directText: `This low-level creature's AC is Extreme (AC near ${TABLES.AC[level]['Extreme']}).`,
        reasoningQuote: 'Creatures with an extreme AC at lower levels can make for frustrating foes that require exceptionally high rolls to hit',
        percentThatFailThis: '3%', // of low-level creatures.  btw, 0 in Starfinder!
      },
    )
  }
    // > Almost no creature should have more than one extreme save, even at high levels.
  // e.g. Lesser Death, Oath Archdragon, Animated Colossus, Riekanoy
  else if (saveValues.filter(v => v === 'Extreme').length >= 2) {
    warnings.push(
      {
        id: 'more-than-one-extreme-save',
        directText: `This creature has more than one extreme save (${TABLES.SAVES[level]['Extreme']} is extreme).`,
        reasoningQuote: 'Almost no creature should have more than one extreme save, even at high levels.',
        percentThatFailThis: '0.2%',
      },
    )
  }
  // e.g. Vazgorlu, Weredigo, Syndara the Sculptor
  else if (defenseValues.filter(v => v === 'High' || v === 'Extreme').length === 3 &&
    defenseValues.filter(v => v === 'Low' || v === 'Terrible').length === 0) {
    warnings.push(
      {
        id: 'three-high-defenses-no-low',
        directText: `This creature has three high defenses and no low defense (low AC would be ${TABLES.AC[level]['Low']}, low save would be ${TABLES.SAVES[level]['Low']}).`,
        reasoningQuote: 'Statistics should be balanced overall. Almost no creature has great defenses in all areas, and such creatures often result in frustrating fights.',
        percentThatFailThis: '1%',
      },
    )
  }
  // e.g. Hunter, Simulacrum, Blink Dog, Enormous Flame Drake, Owb Prophet
  // actually I'm canceling this for now -- it's more common than I'd like, and not clearly bad
  //else if (defenseValues.filter(v => v === 'Moderate' || v === 'High' || v === 'Extreme').length >= 4) {
  //  if (!warnings.find(w => w.id === "no-low-statistics-at-all") && !warnings.find(w => w.id === "three-high-defenses-no-terrible"))
  //  warnings.push(
  //    {
  //      id: 'no-low-defenses',
  //      directText: `This creature has no low defenses, they're all moderate (${TABLES.AC[level]['Moderate']} AC, ${TABLES.SAVES[level]['Moderate']} saves) or higher.`,
  //      reasoningQuote: 'This might be intentional, but it\'s unusual, and may result in a boring fight.',
  //      percentThatFailThis: '4%',
  //    },
  //  )
  //}
  // > As mentioned in the Defenses section above, you don't want a creature with extreme AC to have high HP too.
  // e.g. Wererat, Stickfoot, Agradaemon
  if (level >= 1 &&
    [summarizedStatistics.ac, summarizedStatistics.hp].includes('Extreme') &&
    [summarizedStatistics.ac, summarizedStatistics.hp].filter(v => v === 'High' || v === 'Extreme').length >= 2
  ) {
    warnings.push(
      {
        id: 'high-ac-and-hp',
        directText: `This creature has very high AC (${npc.system.attributes.ac.value} > ${TABLES.AC[level]['Moderate']}) and HP (${npc.system.attributes.hp.max} > ${TABLES.HP[level]['Moderate']}), one of them extreme.`,
        reasoningQuote: 'Almost no creature has great defenses in all areas, and such creatures often result in frustrating fights. You don\'t want a creature with extreme AC to have high HP too.',
        percentThatFailThis: '1%',
      },
    )
  }
  // > A creature with a resistance, especially a broad resistance or a physical resistance, usually has fewer HP.
  // e.g. Fire Jellyfish Swarm, Cyclops Zombie, Green Monkey
  if (hasBroadResistance && (summarizedStatistics.hp === 'High' || summarizedStatistics.hp === 'Extreme')) {
    warnings.push(
      {
        id: 'broad-resistance-and-high-hp',
        directText: `This creature has a broad resistance and its HP is high (${npc.system.attributes.hp.max} > ${TABLES.HP[level]['Moderate']}).`,
        reasoningQuote: 'A creature with a resistance, especially a broad resistance or a physical resistance, usually has fewer HP.',
        percentThatFailThis: '2%', // of creatures with High+ HP
      },
    )
  }
  // > While you can give your creature a fly Speed at those low levels, it's better to wait until around 7th level (when PCs gain access to fly) to give your creature a fly Speed if it also has ranged attacks or another way to harry the PCs from a distance indefinitely.
  // e.g. Living Thunderclap, Draxie, Flaming skull, Storm Hag
  if (game.system.id === 'pf2e'
    && level <= 5
    && npc.system.movement.speeds.fly
    && npc.system.actions.some(a => a.type === 'strike' && a.item.isRanged)
  ) {
    warnings.push(
      {
        id: 'fly-speed-at-low-level',
        directText: 'This low-level creature has a fly speed and a ranged attack.',
        reasoningQuote: 'While you can give your creature a fly Speed at those low levels, it\'s better to wait until around 7th level (when PCs gain access to fly) to give your creature a fly Speed if it also has ranged attacks or another way to harry the PCs from a distance indefinitely.',
        percentThatFailThis: '20%', // of low-level creatures with a ranged attack
      },
    )
  }
  // in starfinder the limit is lower and the system still breaks its guidelines often...
  // e.g. Noquasar Spark, Hardlight Dragonet, Clangit
  if (game.system.id === 'sf2e'
    && level <= 0
    && npc.system.movement.speeds.fly
    && npc.system.actions.some(a => a.type === 'strike' && a.item.isRanged)
  ) {
    warnings.push(
      {
        id: 'fly-speed-at-low-level',
        directText: 'This very-low-level creature has a fly speed and a ranged attack.',
        reasoningQuote: 'it\'s better to wait until around 3rd level (when PCs have enough feats to support ranged attacks and access to items like jump jets and jet packs) to give your creature a fly Speed if it also has ranged attacks or another way to harry the PCs from a distance indefinitely.',
        percentThatFailThis: '35%', // of very-low-level creatures with a ranged attack
      },
    )
  }
  // > You might use a lower category if the creature has better accuracy, or a higher category if its accuracy is lower.
  // > A creature that's meant to be highly damaging uses the extreme damage values, but might then have a moderate attack bonus.
  // e.g. Aspect of Insects, Sea Devil Invader, Brimorak, Mukradi, Phoenix, Ostovite
  for (const [att, dam] of [['attack1', 'damage1'], ['attack2', 'damage2'], ['attack3', 'damage3'], ['attack4', 'damage4'], ['attack5', 'damage5'], ['attack6', 'damage6'], ['attack7', 'damage7'], ['attack8', 'damage8']]) {
    const scales = [summarizedStatistics[att], summarizedStatistics[dam]]
    if (scales.includes('Extreme')
      && !scales.includes('Moderate') && !scales.includes('Low') && !scales.includes('Terrible')) {
      warnings.push(
        {
          id: `high-attack-and-damage`,
          directText: `This creature has an attack with extreme attack bonus and high damage, or vice versa.  Usually if one of these is extreme, the other is moderate or low.`,
          reasoningQuote: 'You might use a lower category if the creature has better accuracy, or a higher category if its accuracy is lower. A creature that\'s meant to be highly damaging uses the extreme damage values, but might then have a moderate attack bonus.',
          percentThatFailThis: '1.5%',
        },
      )
    }
  }
  // > A creature that's meant to be primarily a melee threat uses high damage for its melee Strikes, or moderate for melee Strikes that have the agile trait. Ranged attacks more typically use the moderate value, or even low.
  // e.g. Tzitzimitl
  if (level >= 2) {
    for (const action of npc.system.actions) {
      if (action.type === 'strike') {
        const strike = action.item
        const damageRolls = strike.system.damageRolls
        const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData), 0)
        const damageScale = getSimpleScale(avgTotalDamage, level, 'strike_damage')
        if (strike.system.traits.value.includes('agile') && damageScale === 'Extreme') {
          warnings.push(
            {
              id: 'agile-strike-with-extreme-damage',
              directText: 'This creature has an agile strike with extreme damage.',
              reasoningQuote: 'A creature that\'s meant to be primarily a melee threat uses high damage for its melee Strikes, or moderate for melee Strikes that have the agile trait.',
              percentThatFailThis: '0.2%', // of creatures with agile strikes, level 2+
            },
          )
        }
        if (strike.isRanged && damageScale === 'Extreme') {
          // e.g. Jafaki, Grothlut, Kadamel, Siegebreaker
          warnings.push(
            {
              id: 'ranged-strike-with-extreme-damage',
              directText: 'This creature has a ranged strike with extreme damage.',
              reasoningQuote: 'A creature that\'s meant to be primarily a melee threat uses high damage for its melee Strikes, or moderate for melee Strikes that have the agile trait. ' +
                'Ranged attacks more typically use the moderate value, or even low.',
              percentThatFailThis: '0.4%', // of creatures with ranged strikes, level 2+
            },
          )
        }
      }
    }
  }

  // deduplicate by id
  const uniqueWarnings = new Map()
  for (const warning of warnings) {
    if (!uniqueWarnings.has(warning.id)) {
      uniqueWarnings.set(warning.id, warning)
    }
  }
  // return as array
  return Array.from(uniqueWarnings.values())
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
    calculateAndMarkStatisticInHtmlInItt(html, npc, statistic, getProperty(npc, statistic.property))
  }
  // Passive stealth and passive athletics
  for (const frontSkillName of ['stealth', 'athletics']) {
    if (game.settings.get('pf2e-token-hud', 'others') === 'none') continue
    const statistic = {
      name: 'Skill',
      translatedName: localize('.StatisticTooltip.StatisticType.skill'),
      type: 'skill',
      ittSelector: `A[data-slug="${frontSkillName}"]`,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
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
      translatedName: localize('.StatisticTooltip.StatisticType.skill'),
      type: 'skill',
      ittSelector: `DIV.skill    A[data-action="roll-skill"][data-slug="${longSlug}"]`,
      styleOptionUsed: 'primary',
      positiveHasPlus: true,
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
      translatedName: localize('.StatisticTooltip.StatisticType.strike_attack'),
      type: 'strike_attack',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `DIV.strike.details[data-index="${actionIndex}"]   DIV.variants    DIV[data-action="strike-attack"][data-index="0"]`,
      styleOptionUsed: 'secondary',
      positiveHasPlus: true,
    }, attackBonus)
    const damageRolls = npc.system.actions[actionIndex].item.system.damageRolls
    const avgTotalDamage = Object.values(damageRolls).reduce((acc, rollData) => acc + calcAvgDamage(rollData), 0)
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
      translatedName: localize('.StatisticTooltip.StatisticType.strike_damage'),
      type: 'strike_damage',
      // selector for the first strike button (without the MAP strike buttons)
      selector: `DIV.strike.details[data-index="${actionIndex}"]   DIV.variants    DIV[data-action="strike-damage"]`,
      styleOptionUsed: 'secondary',
      positiveHasPlus: false,
    }, avgTotalDamage)
  }
}

const getSkillProperty = (npc, skillName) => {
  if (skillName === 'perception') // not actually a skill but still shown in that skills sidebar
    return getProperty(npc, '_source.system.perception.mod')
  return getProperty(npc, `skills.${skillName}.base`)
    // untrained will sadly be affected by some status effects (is not "base"/"source")
    || getProperty(npc, `skills.${skillName}.modifiers.0.modifier`)
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

const addElementToNpcSheet = (sheet, html) => {
  let isEnabled = game.settings.get(MODULE_ID, 'toggle-on')
  const maybeActive = isEnabled ? 'active' : ''
  const text = localize(`.ToggleButton`)
  const newNode = `
<div class="pf2e-see-simple-scale-statistics-container">
  <div class="pf2e-see-simple-scale-statistics-change-mode ${maybeActive}">
    <div>
      <a>${text}</a>
    </div>
    ${colorLegend()}
  </div>
</div>
`
  if (html.find('div.adjustments').length > 0) {
    html.find('div.adjustments > a.elite').before(newNode)
  } else if (html.find('select.size-select').length > 0) {
    // e.g. for NPC sheets opened through compendium, also for simple npc sheets
    html.find('select.size-select').after(newNode)
  } else if (html.find('header > div.rarity-size > div.tags').length > 0) {
    // uhhh for other NPC sheets opened through compendium
    html.find('header > div.rarity-size > div.tags').after(newNode)
  }
  html.find('DIV.pf2e-see-simple-scale-statistics-change-mode > div > a').click(() => {
    isEnabled = !isEnabled
    game.settings.set(MODULE_ID, 'toggle-on', isEnabled)
    refreshLegend(html, isEnabled)
    markStatisticsInNpcSheet(sheet.object, html, sheet.template)
    // TODO refactor and streamline these a little, also increase performance
    if (isEnabled) {
      const warnings = judgeNpcStatisticsByGuidelines(sheet.object, sheet.template)
      refreshWarningsElement(html, warnings)
    }
  })
}

const addWarningsToNpcSheet = (sheet, html) => {
  const isEnabled = game.settings.get(MODULE_ID, 'warnings-mode') !== 'disabled'
  const newNode = `
<a class="pf2e-see-simple-scale-statistics-warnings-button"></a>
`
  html.find('DIV.pf2e-see-simple-scale-statistics-change-mode').before(newNode)
  if (isEnabled) {
    const warnings = judgeNpcStatisticsByGuidelines(sheet.object, sheet.template)
    refreshWarningsElement(html, warnings)
  }

  html.find('A.pf2e-see-simple-scale-statistics-warnings-button').click(() => {
    const warnings = judgeNpcStatisticsByGuidelines(sheet.object, sheet.template)
    refreshWarningsElement(html, warnings)
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

const refreshWarningsElement = (html, warnings) => {
  const warningsButton = html.find('A.pf2e-see-simple-scale-statistics-warnings-button')
  if (warnings.length === 0) {
    warningsButton.removeClass('active')
    warningsButton.html(`<i class="fa fa-solid fa-list-check fa-xl"/>`)
    warningsButton.attr('data-tooltip-html', `<p>No guideline-breaking statistics found!  Click to re-check.</p>`)
    warningsButton.attr('data-tooltip-class', 'pf2e-see-simple-scale-statistics-warnings-tooltip')
    return
  }
  warningsButton.addClass('active')
  warningsButton.html(
    `<span class="fa-stack fa-fw">
        <i class="fa fa-stack-2x fa-solid fa-triangle" style="color: gold"></i>
        <i class="fa fa-stack-2x fa-regular fa-triangle-exclamation" style="color: black"></i>
        <i class="fa fa-stack-1x fa-solid fa-circle " style="color: tomato; transform: scale(1.2) translate(7px, -9px)"></i>
        <i class="fa fa-stack-1x fa-solid fa-${warnings.length}" style="color: white; transform: scale(0.9) translate(9px, -12px)"></i>
    </span>`,
  )

  const warningsHtml = warnings.map((w, i) =>
    `<p>
  <b>${i + 1}. ${w.directText}</b>
  <br/>
  <i>${w.reasoningQuote}</i>
  <br/>
  (${(w.percentThatFailThis === '0%' || w.percentThatFailThis.indexOf('%') === 2) ? '' : 'only '}${w.percentThatFailThis} of relevant creatures fail this guideline.)
</p>`,
  ).join('')
  //+ `<p><br/><br/><i>Click to re-check.</i></p>`
  warningsButton.attr('data-tooltip-html', warningsHtml)
  warningsButton.attr('data-tooltip-class', 'pf2e-see-simple-scale-statistics-warnings-tooltip')
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
    default: true,
  })
  game.settings.register(MODULE_ID, 'warnings-mode', {
    name: `Warn about guideline-breaking statistics`,
    hint: `Warnings are shown next to the button, in NPC sheets that e.g. have too many extreme statistics.`,
    scope: 'client',
    config: true,
    type: String,
    choices: {
      'disabled': 'Disabled',
      'full': 'Fully enabled',
      'atheist': 'Yes, except don\'t warn about missing Holy and Unholy traits pre-remaster',
    },
    default: 'full',
  })
}

Hooks.once('init', () => {
  initializeTables()
  registerSettings()
  Hooks.on('renderActorSheetPF2e', (sheet, html, _) => {
    if (sheet.object.type !== 'npc') return
    addElementToNpcSheet(sheet, html)
    // todo cleanup code a bit, increase performance for frequent renders
    const isEnabled = game.settings.get(MODULE_ID, 'toggle-on') && !(sheet.object.attributes.adjustment === 'elite' || sheet.object.attributes.adjustment === 'weak')
    if (isEnabled) {
      markStatisticsInNpcSheet(sheet.object, html, sheet.template)
    } else {
      // find all elements with pf2e-ssss class
      // remove their other classes that start with pf2e-ssss
      html.find(`.pf2e-ssss`).each((_, el) => {
        const $el = $(el)
        $el.removeClass((_index, className) => className.startsWith(MODULE_ID))
      })
    }
    addWarningsToNpcSheet(sheet, html)
  })
  // integration - PF2E interactive token tooltip
  // TODO - integrate with pf2e-hud instead
  Hooks.on('renderHUD', (application, pf2eTokenHudHtml, _someActorData) => {
    if (!game.settings.get(MODULE_ID, 'toggle-on')
      || game.settings.get(MODULE_ID, 'pf2e-itt-integration') === 'disabled')
      return
    if (application.actor?.type !== 'npc')
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

self.PF2E_SEE_SIMPLE_SCALE_STATISTICS = {
  TABLES,
  TABLE_OF_TYPE,
  getScaleNumbers,
  getSimpleScale,
  shemetzConsoleCode,
  judgeNpcStatisticsByGuidelines,
}
