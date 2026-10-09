import json, os, sys, datetime, html
from clusters import C
from opps import OPPS, SEARCHES
D=os.path.join(os.path.dirname(__file__),'..','data')
R=json.load(open(D+'/kanallar_ham.json'))
code_of={n:k for k,(_,l) in C.items() for n in l}
T=datetime.date(2026,10,9)
rows=[]
for r in R:
    k=code_of[r['n']]; age=(T-datetime.date.fromisoformat(r['first'])).days if r['first'] else r.get('days')
    rows.append([r['n'],r['title'],r['url'],k,r['lang'] or '',r['rev'],r['subs'],r['vids'],r['avgv'],round(r['len']),round(r['rpm'],1) if r['rpm'] else None,1 if r['ai'] else 0,age,
                 [[t,v] for t,v,_ in r['vt'][:3]]])
CHECK={"EBIKEPOV":"Açık – tek kanal","SHERLOCK":"Kısmen açık","AMISH":"Kopya dolu","BATTLEGRAVE":"Kısmen açık","AFTERCROWN":"Kopya dolu","COPCOURT":"Dolu","USPOVERTY":"Açık","SENIORDIY":"Kısmen dolu","OCEAN4K":"Dolu","NOBODYVISIT":"Kısmen açık","FINANCE":"Dolu","BIZFALL":"Dikeyde açık","JAPANLIFE":"Dolu","CLASSICTV":"Açık açı var","MILHIST":"WW2 dışı açık"}
rev={r[0]:r[5] for r in rows}
concepts=[]
for k,(name,ns) in C.items():
    tot=sum(rev[n] for n in ns)
    concepts.append([k,name,len(ns),tot,round(tot/len(ns)),max(rev[n] for n in ns),CHECK.get(k,'')])
data=dict(rows=rows,concepts=concepts,opps=sorted([list(o) for o in OPPS],key=lambda o:-o[6]),searches=[list(s) for s in SEARCHES],names={k:v[0] for k,v in C.items()})
tpl=open(os.path.join(os.path.dirname(__file__),'page_template.html')).read()
open(sys.argv[1],'w').write(tpl.replace('/*DATA*/null',json.dumps(data,ensure_ascii=False).replace('\ufffd','').replace('</','<\\/')))
print('ok',os.path.getsize(sys.argv[1]))
