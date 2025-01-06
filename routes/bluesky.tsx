import bluesky from '../bluesky-data.json' with {type: "json"}
import {BlueskyHandle, PartyVignette} from '../components/Results.tsx'
import {hasRecentTweets} from '../date-utils.ts'
import députésRandomOrder from '../députés.ts'
import OpenBlueskyTabs from '../islands/OpenBlueskyTabs.tsx'
const blueskyEntries = Object.entries(bluesky)


				const ats = blueskyEntries.map(([,{bsky}]) =>  bsky && ('@' + bsky)).filter(Boolean)

const atsMessages =  ats.reduce((memo, next)=> {

		const currentMemo = memo[0]
		const nextLength = currentMemo.length + next.length
		if (nextLength > 299)
		return [next, ...memo]
		return [currentMemo+ ' '+ next, ...memo.slice(1)]

}, [''])

export default function Bluesky() {
		
  return <main>

				<h1>Voici la liste des députés français présents sur Bluesky</h1>
				{atsMessages.map(text => 
						<div>
		<textArea key={text} style={{width: '12rem', height: '6rem', margin: '1rem'}}>{text



		}</textArea><OpenBlueskyTabs ats={text.split(' ')}/> </div>)}

				<ul>{blueskyEntries
		  .filter(([, {bsky} ])=> bsky)


		  .map(([id, {nom, prenom, groupeAbrev, bsky, activité, analyseDate}])=>{

				  const député = députésRandomOrder.find(d => d.id===id)

				  return(<li style={{marginBottom: '1rem'}} key={id}>

				  <div>{prenom} {nom}</div>
				  
		<PartyVignette party={groupeAbrev} small={true}/>
				  <BlueskyHandle député={député} invert={false}/>
				  <div>{(activité && hasRecentTweets(activité, analyseDate)) ? 'Actif' : 'Non actif'}</div>


				  </li>)})}
</ul>
</main>
}
