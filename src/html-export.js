import { DamageTypes } from '@/enums';
import { damageTypeToImage } from '@/helpers';

const c = {
    'background-color': '0, 0, 0',
    'gradient-dark': '24, 20, 17',
    'gradient-bright': '46, 38, 29',
    'border-color': '110, 80, 54',
    'text-color-secondary': '153, 124, 97',
    'text-color-secondary-hover': '201, 164, 129',
    'text-color': '255, 255, 255',
    'shadow-color': '0, 0, 0',
    'color-confirm': '52, 72, 53',
    'color-confirm-hover': '81, 99, 64',
}

const divStyle = {
    'display': 'flex',
    'gap': '.5rem',
    'align-items': 'center',
    'justify-content': 'center',
}

const hasTooltip = {
    'position': 'relative',
}

const textTooltip = {
    'background': `rgb(${c['gradient-bright']})`,
    'position': 'absolute',
    'visibility': 'hidden',
    'z-index': '1',
    'border-radius': '.5rem',
    'border': `.125rem solid rgb(${c['border-color']})`,
    'padding': '.5rem',
    'width': 'max-content',
    'max-width': '14rem',
    'text-align': 'left',
    'display': 'flex',
    'justify-content': 'flex-start !important',
    'font-size': '1rem',
}

const textTooltipAbove = {
    ...textTooltip,
    'bottom': 'calc(100% + .25rem)',
    'left': '50%',
    'transform': 'translate(-50%, 0)',
}

const textTooltipRight = {
    ...textTooltip,
    'left': 'calc(100% + 7.25rem)',
    'bottom': '0',
    'width': '14rem',
}

const actionTooltip = {
    'background': `rgb(${c['gradient-bright']})`,
    'position': 'absolute',
    'visibility': 'hidden',
    'z-index': '1',
    'border-radius': '.5rem',
    'border': `.125rem solid rgb(${c['border-color']})`,
    'padding': '.5rem',
    'bottom': 'calc(100% + .25rem)',
    'left': '50%',
    'transform': 'translate(-50%, 0)',
}

const modifierBonus = (abilityScore) => {
    const bonus = Math.floor((abilityScore - 10) / 2)
    return bonus > 0 ? `+${bonus}` : bonus === 0 ? '+0' : bonus
}

const headline = (statblock) => {
    const line = [];
    statblock.cr && line.push(`CR ${statblock.cr}`)
    statblock.size && line.push(statblock.size)
    statblock.type && line.push(statblock.type)
    statblock.subtype && line.push(statblock.subtype)
    statblock.alignment && line.push(statblock.alignment)
    return (line && line.length > 0) && line.reduce((a, b) => `${a}, ${b}`) || ''
}

const objToStyle = (style) => {
    return Object.entries(style).map(([k, v]) => `${k}: ${v};`).join(' ')
}

const element = (element, style, value, classes) => {
    var attributes = [
        style && `style="${objToStyle(style)}"`,
        classes && `class="${classes}"`,
    ].filter(v => v).join(' ')
    if (attributes) {attributes = ' ' + attributes}

    return `<${element}${attributes}>${value}</${element}>`
}

const img = (src, style) => {
    return style ? `<img src="${src}" style="${objToStyle(style)}"/>` : `<img src="${src}"/>`
}

const featureContainer = (title, itemTitle, collection, image, roundImage = false) => {
    if (!(collection && collection.length > 0 && collection.some(e => e.name || e.desc))) {
        return ''
    }

    return element('div', {...divStyle, 'flex-direction': 'column', 'width': 'calc(50% - .5rem)'},
        element('span', {'font-size': '1rem'}, 
            img('decor_header.webp', {'margin-right': '1rem', 'display': 'inline-block', 'height': 'calc(20rem * 0.035)', 'width': 'calc(84rem * 0.035)'}) +
            title +
            img('decor_header.webp', {'margin-left': '1rem', 'display': 'inline-block', 'height': 'calc(20rem * 0.035)', 'width': 'calc(84rem * 0.035)', 'transform': 'scale(-1, 1)'}),
        ) +
        element('div', {...divStyle, 'background-color': `rgb(${c['gradient-dark']})`, 'flex-direction': 'column', 'gap': '.25rem', 'align-items': 'baseline', 'padding': '.25rem 1rem', 'border-radius': '.5rem', 'width': '100%'},
            collection.filter(t => t.name || t.desc).map(trait =>
                element('div', {...divStyle, ...hasTooltip, 'width': '100%', 'border-radius': '.5rem'}, 
                    img(image, {'border-radius': (roundImage ? '50%' : '.125rem'), 'width': '2rem', 'height': '2rem', 'background-color': `rgb(${c['gradient-bright']})`, 'border': `.125rem solid rgb(${c['border-color']})`}) +
                    element('div', {...divStyle, 'position': 'relative', 'width': '100%', 'height': '2.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`, 'margin-right': 'auto', 'margin-bottom': 'auto'}, trait.name?.replace(/\.$/,'')) +
                        element('span', {
                            'color': `rgba(${c['text-color-secondary']}, .5)`,
                            'text-overflow': 'ellipsis',
                            'overflow': 'hidden',
                            'white-space': 'nowrap',
                            'position': 'absolute',
                            'width': '100%',
                            'height': '100%',
                            'margin-right': 'auto',
                            'margin-top': '2.5rem',
                            'font-size': '.875rem',
                            'text-align': 'left',
                        }, trait.desc)
                    ) +
                    element('div', {...divStyle, ...actionTooltip, 'width': '100%'},
                        element('div', {...divStyle, 'flex-direction': 'column', 'align-items': 'baseline', 'gap': '0', 'position': 'relative', 'text-align': 'left'},
                            element('span', {'font-size': '1.25rem', 'margin-right': '5rem'}, trait.name?.replace(/\.$/,'')) +
                            element('span', {'color': `rgb(${c['text-color-secondary']})`, 'font-size': '1rem'}, itemTitle) +
                            element('span', {'font-size': '1rem'}, trait.desc) +
                            img(image, {'position': 'absolute', 'background': 'transparent', 'width': '5rem', 'height': '5rem', 'right': '-1.5rem', 'top': '-1.5rem'})
                        ),
                    'tooltip'),
                'has-tooltip')
            ).join('')
        )
    )
}

export const statblockToInlineHtml = (statblock) => {
    const resistances = Object.values(DamageTypes).map(t => {return {
            name: t[0].toUpperCase() + t.slice(1),
            image: damageTypeToImage(t).split('/').at(-1),
            vulnerable: statblock.damage_vulnerabilities?.toLowerCase().includes(t),
            resistant: statblock.damage_resistances?.toLowerCase().includes(t),
            immune: statblock.damage_immunities?.toLowerCase().includes(t),
        }}).filter(t => t.vulnerable || t.resistant || t.immune)

    return element('div', {
        'border-radius': '.5rem',
        'border': `.25rem solid rgb(${c['border-color']})`,
        'background-image': `linear-gradient(0deg, rgb(${c['gradient-dark']}) 0%, rgb(${c['gradient-bright']}) 100%)`,
        'padding': '1rem',
        'display': 'flex',
        'flex-wrap': 'wrap',
        'align-items': 'baseline',
        'gap': '1rem',
        'width': '100%',
        'color': `rgb(${c['text-color']})`,
        'font-family': '\\"Aldine 721 Bold BT\\"',
        'font-weight': '500',
        'font-size': '1rem',
    },
        `<!-- ${JSON.stringify(statblock)} -->` +
        element('div', {...divStyle, 'width': '100%'},
            element('div', {...divStyle, 'width': 'calc(50% - .5rem)'},
                // Other Info
                element('div', {
                    ...divStyle,
                    'width': '4rem',
                    'flex-direction': 'column',
                    'gap': '0',
                },
                    (statblock.senses ? element('div', {...divStyle, ...hasTooltip, 'border-radius': '.5rem'},
                        img('sneak_64_64.webp', {'width': 'calc(64rem * 0.035)', 'height': 'calc(64rem * 0.035)', 'border-radius': '.5rem'}) +
                        element('div', {...divStyle, ...textTooltipRight}, `Senses: ${statblock.senses}`, 'tooltip')
                    , 'has-tooltip') : '') +
                    (statblock.languages ? element('div', {...divStyle, ...hasTooltip, 'border-radius': '.5rem'},
                        img('race_h.webp', {'width': 'calc(64rem * 0.035)', 'height': 'calc(64rem * 0.035)', 'border-radius': '.5rem'}) +
                        element('div', {...divStyle, ...textTooltipRight}, `Languages: ${statblock.languages}`, 'tooltip')
                    , 'has-tooltip') : '') +
                    (statblock.speed ? element('div', {...divStyle, ...hasTooltip, 'border-radius': '.5rem'},
                        img('speed_64_64.webp', {'width': 'calc(64rem * 0.035)', 'height': 'calc(64rem * 0.035)', 'border-radius': '.5rem'}) +
                        element('div', {...divStyle, ...textTooltipRight}, `Speed: ${statblock.speed}`, 'tooltip')
                    , 'has-tooltip') : '')
                ) +
                // Portrait
                element('div', {...divStyle, 'position': 'relative', 'margin-top': '1.5rem'},
                    element('div', {
                        'height': '8rem',
                        'width': '8rem',
                        'border-radius': '50%',
                        'border': `.25rem solid rgb(${c['border-color']})`,
                        'overflow': 'hidden',
                        'box-shadow': `0 0 .5rem rgb(${c['shadow-color']})`,
                    },
                        img(statblock.image, {
                            'width': '100%',
                            'height': '100%',
                            'object-fit': 'cover',
                            'overflow': 'visible',
                            'transform': `translate(${statblock.image_modifications?.x ?? 0}%, ${statblock.image_modifications?.y ?? 0}%) scale(${statblock.image_modifications?.scale ?? 1})`,
                            'filter': `hue-rotate(${statblock.image_modifications?.hue ?? 0}deg)`,
                        }),
                    ) +
                    element('span', {
                        'background-color': `rgba(${c['gradient-dark']}, .5)`,
                        'border-radius': '.5rem',
                        'padding': '.125rem, .25rem',
                        'position': 'absolute',
                        'left': '50%',
                        'bottom': '.25rem',
                        'transform': 'translate(-50%, 0)',
                        'text-shadow': `rgb(${c['shadow-color']}) 0 0 .5rem`,
                        'white-space': 'nowrap',
                    }, statblock.hp) +
                    // Headline
                    element('span', {
                        'position': 'absolute',
                        'width': '100%',
                        'bottom': 'calc(100% + .5rem)',
                        'left': '50%',
                        'transform': 'translate(-50%, 0)',
                        'text-align': 'center',
                    }, headline(statblock))
                ) +
                // AC Display
                element('div', {...divStyle, 'width': '4rem', 'max-height': '8.5rem', 'position': 'relative'},
                    img('ac_background.webp', {'width': '100%', 'height': '100%'}) +
                    element('span', {
                        'position': 'absolute',
                        'top': 'calc(50% - 1rem)',
                        'left': '50%',
                        'transform': 'translate(-50%, -50%)',
                        'font-size': '1rem',
                        'text-shadow': `rgb(${c['shadow-color']}) 0 0 .5rem`,
                    }, 'AC') +
                    element('span', {
                        'position': 'absolute',
                        'top': 'calc(50% + .5rem)',
                        'left': '50%',
                        'transform': 'translate(-50%, -50%)',
                        'font-size': '1.75rem',
                        'text-shadow': `rgb(${c['shadow-color']}) 0 0 .5rem`,
                        'white-space': 'nowrap',
                    }, statblock.ac),
                )
            ) +
            // Name, Stats and Resistances
            element('div', {...divStyle, 'flex-direction': 'column', 'width': 'calc(50% - .5rem)'},
                // Name
                element('h1', {'padding': '0', 'margin': '0', 'font-size': '1.5rem', 'text-align': 'center'}, statblock.name) +
                // Stats
                element('div', divStyle,
                    element('div', {...divStyle, ...hasTooltip, 'flex-direction': 'column', 'gap': '.25rem', 'margin': '0 .25rem', 'border-radius': '.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`}, 'STR') +
                        element('span', {'font-size': '1.5rem'}, statblock.stats[0]) +
                        element('div', {...divStyle, ...textTooltipAbove}, modifierBonus(statblock.stats[0]), 'tooltip'),
                        'has-tooltip',
                    ) +
                    element('div', {...divStyle, ...hasTooltip, 'flex-direction': 'column', 'gap': '.25rem', 'margin': '0 .25rem', 'border-radius': '.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`}, 'DEX') +
                        element('span', {'font-size': '1.5rem'}, statblock.stats[1]) +
                        element('div', {...divStyle, ...textTooltipAbove}, modifierBonus(statblock.stats[1]), 'tooltip'),
                        'has-tooltip',
                    ) +
                    element('div', {...divStyle, ...hasTooltip, 'flex-direction': 'column', 'gap': '.25rem', 'margin': '0 .25rem', 'border-radius': '.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`}, 'CON') +
                        element('span', {'font-size': '1.5rem'}, statblock.stats[2]) +
                        element('div', {...divStyle, ...textTooltipAbove}, modifierBonus(statblock.stats[2]), 'tooltip'),
                        'has-tooltip',
                    ) +
                    element('div', {...divStyle, ...hasTooltip, 'flex-direction': 'column', 'gap': '.25rem', 'margin': '0 .25rem', 'border-radius': '.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`}, 'INT') +
                        element('span', {'font-size': '1.5rem'}, statblock.stats[3]) +
                        element('div', {...divStyle, ...textTooltipAbove}, modifierBonus(statblock.stats[3]), 'tooltip'),
                        'has-tooltip',
                    ) +
                    element('div', {...divStyle, ...hasTooltip, 'flex-direction': 'column', 'gap': '.25rem', 'margin': '0 .25rem', 'border-radius': '.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`}, 'WIS') +
                        element('span', {'font-size': '1.5rem'}, statblock.stats[4]) +
                        element('div', {...divStyle, ...textTooltipAbove}, modifierBonus(statblock.stats[4]), 'tooltip'),
                        'has-tooltip',
                    ) +
                    element('div', {...divStyle, ...hasTooltip, 'flex-direction': 'column', 'gap': '.25rem', 'margin': '0 .25rem', 'border-radius': '.5rem'},
                        element('span', {'color': `rgb(${c['text-color-secondary']})`}, 'CHA') +
                        element('span', {'font-size': '1.5rem'}, statblock.stats[5]) +
                        element('div', {...divStyle, ...textTooltipAbove}, modifierBonus(statblock.stats[5]), 'tooltip'),
                        'has-tooltip',
                    )
                ) +
                // Resistances
                ((resistances && resistances.length > 0) ? (
                    element('span', {'font-size': '1rem'}, 
                        img('decor_header.webp', {'margin-right': '1rem', 'display': 'inline-block', 'height': 'calc(20rem * 0.035)', 'width': 'calc(84rem * 0.035)'}) +
                        'Resistances' +
                        img('decor_header.webp', {'margin-left': '1rem', 'display': 'inline-block', 'height': 'calc(20rem * 0.035)', 'width': 'calc(84rem * 0.035)', 'transform': 'scale(-1, 1)'}),
                    ) +
                    element('div', {...divStyle, 'flex-wrap': 'wrap', 'gap': '0'}, resistances.map(res =>
                        element('div', {
                            ...divStyle,
                            ...hasTooltip,
                            'width': 'calc(80rem * 0.025)',
                            'height': 'calc(104rem * 0.025)',
                            'border-radius': '.5rem',
                            'padding': '.125rem',
                            'margin': '.25rem .125rem 0 .125rem',
                        },
                            img(res.image, {'width': '100%', 'height': '100%'}) +
                            (res.immune ? img('immune.webp', {'width': 'calc(96rem * 0.025)', 'height': 'calc(124rem * 0.025)', 'position': 'absolute'}) : '') +
                            (res.resistant ? img('resistant.webp', {'width': 'calc(68rem * 0.025)', 'height': 'calc(60rem * 0.025)', 'position': 'absolute', 'top': '-1rem'}) : '') +
                            (res.vulnerable ? img('vulnerable.webp', {'width': 'calc(68rem * 0.025)', 'height': 'calc(60rem * 0.025)', 'position': 'absolute', 'top': '-1rem'}) : '') +
                            element('div', textTooltipAbove, res.name + (res.immune ? ' (Immune)' : '') + (res.resistant ? ' (Resistant)' : '') + (res.vulnerable ? ' (Vulnerable)' : ''), 'tooltip'),
                            'has-tooltip'
                        )).join('')
                    )
                ) : ''),
            )
        ) +
        featureContainer('Notable Features', 'Feature', statblock.traits, 'generic_buff.webp', true) +
        featureContainer('Actions', 'Action', statblock.actions, 'generic_action.webp') +
        featureContainer('Bonus Actions', 'Bonus Action', statblock.bonus_actions, 'generic_action.webp') +
        featureContainer('Reactions', 'Reaction', statblock.reactions, 'generic_buff.webp', true),

    )
}
