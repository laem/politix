import bluesky from '../bluesky-data.json' with {type: "json"}
import {BlueskyHandle, PartyVignette} from '../components/Results.tsx'
import {hasRecentTweets} from '../date-utils.ts'
import députésRandomOrder from '../députés.ts'
const blueskyEntries = Object.entries(bluesky)


export default function Bluesky() {
  return <ul>{blueskyEntries
		  .filter(([, {bsky} ])=> bsky)


		  .map(([id, {nom, prenom, groupeAbrev, bsky, activité}])=>{

				  const député = députésRandomOrder.find(d => d.id===id)

				  return(<li style={{marginBottom: '1rem'}} key={id}>

				  <div>{prenom} {nom}</div>
				  
		<PartyVignette party={groupeAbrev}/>
				  <BlueskyHandle député={député} invert={false}/>
				  <div>{(activité && hasRecentTweets(activité)) ? 'Actif' : 'Non actif'}</div>


				  </li>)})}
</ul>
}
