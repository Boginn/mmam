
# pickMethodAttack(fighter) is called
<b> returns method as a <i>string</i></b>
```
Based on the fighters grappler/striker ratio, the manager cannot control which he favours.
```
 <h5>
 methods: 
 <ul>
  <li>disengage</li>
  <li>compose</li>
  <li>strike(inside)</li>
  <li>strike(outside)</li>
  <li>grapple(inside)</li>
  <li>grapple(outside</li>
  </ul>
 </h5>

  # engage(method, attacker, defender) is called
 <b> returns outcome as an <i>object</i></b>
```
Based on gameplan. The manager should learn the fighter's strength and set personal instructions on the type of grappling and striking he does.
i.e. came in on own volition to grapple() and according to gameplan goes for takedown() or clinch()
```
 ### picks sub-method/type
 ```
For now it rolls against the list of takedowns(singleLeg, doubleLeg, hipToss etc) to randomly choose one. Perhaps each fighter could have a preferred moves list to be checked against the list of takedowns.
```
<h2> calls chosen action (singleLeg, oneTwo etc)</h2>
<ul>
  <li>the action gets a physical DC and a skill DC</li>
  <li>physical checks are done. those are universal: (normalMovePhysicalCheck, bigActionPhysicalCheck)</li>
  <li>skill checks are done. those are unique to each action</li>
  <li>those are added and compared. if the attacker has more or equal he sees a varying degree of success: 
    <ul>
      <li>>= 15, devastating</li>
      <li>>= 10, significant</li>
      <li>>= 5, complete</li>
      <li>else, barely</li>
    </ul>
  </li>
  <li></li>
</ul>

 ```
Striking does more damage, and exposes the striker, more than grappling.
Grappling stalls the fight but can lead to submissions too.
After a successful grapple action the defender gets flagged for having to save the next time he gets initiative (defender.match.save = true).
```

<hr>

 # Physical Checks
 # Skill Checks

  