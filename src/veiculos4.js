// ===== 3.7: 800 carros reais por marca, modelo, versão e ano =====
// IDs permanentes (marca_modelo_versao_ano): o save guarda o id e o desenho sai daqui.
// linha: Marca|Modelo|forma|preço 0 km|mercados (1º = onde é feito; * = mundo todo)|Versão*mult@ano-ano,...|ajustes do desenho
const VEIC4_TXT={
'Hatches e compactos':`Volkswagen|Gol|hatch|68000|BR,AR|1.0@2009-2022,1.6 MSI@2009-2022,Track@2018-2022
Volkswagen|Polo|hatch|92000|BR,AR,MX,DE,PT,ES,GB,IN,AO,FR,IT|MPI@2018-2025,200 TSI*1.15@2018-2025,GTS*1.4@2020-2025|L=94
Volkswagen|Golf|hatch|165000|*|Comfortline@2014-2019,GTI*1.4@2014-2024,R*1.8@2015-2024|L=98,yR=20
Volkswagen|up!|hatchP|62000|BR,DE,PT,ES,FR,IT,GB|take up!@2014-2021,TSI*1.2@2015-2021|L=82,roof=28
Fiat|Uno|hatchP|58000|BR,AR|Mille Fire@2004-2013,Vivace@2011-2016,Way@2011-2021,Attractive@2014-2021|box=1,L=86,yR=19,ws=10
Fiat|Palio|hatchP|52000|BR,AR|Fire@2008-2017,ELX@2008-2012,Attractive@2012-2017|L=88
Fiat|Mobi|hatchP|72000|BR,AR|Like@2017-2025,Trekking@2017-2025|L=80,yR=19,rack=1
Fiat|Argo|hatch|85000|BR,AR,MX|Drive 1.0@2018-2025,Trekking 1.3@2018-2025,HGT 1.8*1.2@2018-2020|L=92
Fiat|500|mini|98000|IT,BR,FR,ES,PT,DE,GB,US,CA,MX,JP|Pop@2008-2020,Lounge@2008-2020,Abarth*1.6@2009-2020|L=80,round=1,ws=15
Chevrolet|Onix|hatch|88000|BR,AR,MX|LT 1.0@2013-2019,LTZ 1.4@2013-2019,LT Turbo@2020-2025,Premier*1.2@2020-2025,RS*1.15@2021-2025|L=94
Chevrolet|Celta|hatchP|45000|BR,AR|Life@2002-2011,Spirit@2006-2015,LT@2012-2015|L=84,yR=20
Chevrolet|Corsa|hatchP|42000|BR,AR,MX|Wind@1995-2002,Joy@2003-2012,Maxx@2005-2012|L=86
Ford|Ka|hatchP|70000|BR,AR,IN,MX|SE 1.0@2015-2021,SE Plus@2015-2021,Freestyle@2018-2021|L=86
Ford|Fiesta|hatch|78000|BR,AR,MX,US,GB,DE,ES,PT,FR,IT,CA|SE@2011-2019,Titanium@2011-2019,ST*1.5@2013-2022|L=90
Ford|Focus|hatch|105000|*|SE@2009-2019,Titanium@2014-2019,ST*1.4@2012-2022|L=98
Renault|Sandero|hatch|76000|BR,AR,FR,ES,PT,IT,GB,DE|Expression@2008-2022,Stepway@2008-2025,RS 2.0*1.3@2015-2021|L=92,yR=20
Renault|Kwid|hatchP|69000|BR,IN,AR,MX|Zen@2017-2025,Intense@2017-2025,Outsider@2020-2025|L=82,yR=19,yS=45,wr=8
Renault|Clio|hatchP|60000|FR,ES,PT,IT,DE,GB,BR,AR|Expression@2003-2016,Intens*1.5@2019-2025|L=88
Peugeot|208|hatch|98000|FR,BR,AR,ES,PT,IT,DE,GB,MX|Active@2013-2025,Griffe@2013-2025,GT*1.3@2020-2025|L=90
Peugeot|206|hatchP|40000|FR,BR,AR,PT,ES|Presence@1999-2010,Sensation@2004-2010|L=86
Citroën|C3|hatch|82000|FR,BR,AR,ES,PT,IT,IN|Tendance@2013-2025,Exclusive@2013-2021,Feel@2022-2025|L=90,yR=19
Toyota|Yaris|hatch|99000|JP,BR,AR,FR,ES,PT,DE,GB,IT,MX|XL@2018-2025,XS@2018-2025,GR*2.8@2021-2025|L=90
Toyota|Etios|hatchP|60000|BR,AR,IN|X@2012-2021,XS@2012-2021,Platinum@2016-2021|L=88
Honda|Fit|hatch|85000|JP,BR,AR,US,CA,MX|LX@2004-2021,EX@2004-2021,EXL@2009-2021|L=90,yR=18,ws=17,hood=20
Hyundai|HB20|hatch|86000|BR|Comfort@2013-2025,Evolution@2017-2025,Sport*1.15@2020-2025|L=92
Hyundai|i30|hatch|120000|KR,BR,DE,PT,ES,GB,FR,IT|GLS@2009-2016,N*1.7@2018-2025|L=96
Hyundai|Grand i10|hatchP|55000|IN,KR,DE,ES,PT,IT,FR,GB|Asta@2014-2025,Sportz@2014-2025|L=82
Kia|Picanto|hatchP|75000|KR,BR,ES,PT,IT,DE,GB,FR,MX|EX@2012-2025,GT-Line*1.2@2018-2025|L=80,yR=19
Nissan|March|hatchP|62000|BR,MX,AR,JP,IN|S@2012-2020,SV@2012-2020,SL@2012-2020|L=84,round=1
Suzuki|Swift|hatchP|80000|JP,IN,ES,PT,IT,GB,DE,FR|GL@2010-2025,Sport*1.4@2012-2025|L=86
Maruti Suzuki|Alto|hatchP|32000|IN|LXi@2012-2025,VXi@2012-2025|L=78,yR=19
Tata|Nano|hatchP|18000|IN|LX@2009-2018|L=72,yR=17,hood=12,ws=12,roof=32
Mini|Cooper|mini|190000|GB,*|Cooper@2014-2025,Cooper S*1.2@2014-2025,John Cooper Works*1.5@2015-2025|top=#F2F3F5,round=1
Mercedes-Benz|Classe A|hatch|250000|DE,*|A 200@2013-2025,A 45 AMG*2@2014-2025|L=98,yR=21
BMW|Série 1|hatch|240000|DE,*|118i@2012-2025,M135i*1.6@2012-2025|L=98,hood=30
Audi|A3 Sportback|hatch|230000|DE,*|Ambiente@2014-2020,S3*1.5@2015-2025|L=98
Seat|Ibiza|hatchP|90000|ES,PT,DE,IT,FR,GB|Style@2017-2025,FR*1.15@2017-2025|L=88
Seat|Leon|hatch|130000|ES,PT,DE,IT,FR,GB|FR@2013-2025,Cupra*1.5@2014-2020|L=96
Opel|Corsa|hatchP|95000|DE,ES,PT,IT,FR|Edition@2015-2025,GS@2020-2025|L=88
Skoda|Fabia|hatchP|88000|DE,ES,PT,IT,FR,GB|Ambition@2015-2025,Monte Carlo@2015-2025|L=88`,
'Sedãs':`Toyota|Corolla|sedan|160000|JP,*|GLi@2015-2025,XEi@2015-2025,Altis*1.2@2015-2025
Honda|Civic|fast|170000|JP,*|LXR@2014-2016,EXL@2017-2021,Touring*1.15@2017-2025
Honda|City|sedanP|115000|JP,BR,AR,IN,MX|EX@2010-2025,EXL@2010-2025
Honda|Accord|sedan|260000|US,CA,MX,JP,KR,BR|EX@2013-2022,Touring@2018-2025|L=114
Chevrolet|Onix Plus|sedanP|98000|BR,AR,MX|LT@2020-2025,Premier@2020-2025
Chevrolet|Prisma|sedanP|72000|BR,AR|LT@2013-2019,LTZ@2013-2019
Chevrolet|Cruze|sedan|140000|BR,AR,US,CA,MX,KR|LT@2012-2023,LTZ@2012-2023
Chevrolet|Malibu|sedan|180000|US,CA,MX,KR|LT@2016-2024|L=114
Volkswagen|Virtus|sedanP|115000|BR,AR,MX,IN|MSI@2018-2025,Highline@2018-2025,GTS*1.3@2022-2025
Volkswagen|Jetta|sedan|170000|MX,BR,US,CA,AR|Comfortline@2015-2025,GLI*1.3@2019-2025
Volkswagen|Voyage|sedanP|75000|BR,AR|1.6@2009-2023
Volkswagen|Passat|sedan|220000|DE,*|Highline@2012-2022|L=114
Fiat|Cronos|sedanP|95000|AR,BR|Drive@2019-2025,Precision@2019-2025
Fiat|Siena|sedanP|50000|BR,AR|EL@2008-2016,Essence@2013-2021
Ford|Fusion|sedan|150000|MX,US,CA,BR,AR|SE@2013-2020,Titanium@2013-2020|L=114
Ford|Ka Sedan|sedanP|72000|BR,AR,IN,MX|SE@2015-2021
Hyundai|HB20S|sedanP|92000|BR|Comfort@2013-2025,Platinum@2020-2025
Hyundai|Elantra|sedan|150000|KR,US,CA,MX,BR,IN|GLS@2011-2025,N*1.5@2022-2025
Hyundai|Sonata|sedan|200000|KR,US,CA|SE@2015-2025|L=114
Kia|Cerato|sedan|130000|KR,BR,MX,AR|SX@2014-2025
Nissan|Versa|sedanP|105000|MX,BR,AR,US,CA|SV@2012-2025,Exclusive@2020-2025
Nissan|Sentra|sedan|150000|MX,BR,AR,US,CA|SV@2014-2025,Exclusive@2014-2025
Toyota|Camry|sedan|280000|US,CA,JP,MX,KR,BR|XLE@2012-2025,XSE@2018-2025|L=114
Toyota|Etios Sedan|sedanP|65000|BR,AR,IN|XS@2013-2021
Renault|Logan|sedanP|70000|BR,AR,IN,FR,ES,PT|Expression@2014-2022
Peugeot|408|sedan|110000|AR,BR,FR|Griffe@2011-2019
Mazda|3 Sedan|sedan|150000|JP,US,CA,MX,ES,DE,GB|Touring@2014-2025
Maruti Suzuki|Dzire|sedanP|45000|IN|VXi@2017-2025
Tata|Tigor|sedanP|42000|IN|XZ@2017-2025
Kia|K5|sedan|190000|KR,US,CA|GT-Line@2021-2025|L=114`,
'SUVs e crossovers':`Jeep|Renegade|box|125000|BR,AR,MX,IT,ES,PT,DE,FR,GB,US,CA|Sport@2016-2025,Longitude@2016-2025,Trailhawk*1.3@2016-2025|L=88,ws=9,roof=34,yR=16,wr=9,doors=4,spare=0
Jeep|Compass|suv|185000|BR,*|Sport@2017-2025,Limited@2017-2025,Trailhawk*1.2@2017-2025
Jeep|Commander|suv|230000|BR,AR|Limited@2022-2025|L=110
Jeep|Grand Cherokee|suv|420000|US,CA,MX,BR,DE,GB,JP,KR|Limited@2014-2025,SRT*1.6@2014-2021|L=110
Jeep|Wrangler|box|420000|US,*|Sport@2012-2025,Rubicon*1.2@2012-2025|spare=1,doors=2
Volkswagen|T-Cross|suvP|140000|BR,AR,MX,DE,ES,PT,IT,FR,GB|200 TSI@2020-2025,Highline@2020-2025
Volkswagen|Nivus|evsuv|135000|BR,AR|Comfortline@2021-2025,Highline@2021-2025
Volkswagen|Tiguan|suv|260000|DE,*|Allspace R-Line@2018-2025
Volkswagen|Taos|suv|200000|MX,BR,AR,US,CA|Highline@2021-2025
Volkswagen|Touareg|suv|480000|DE,GB,FR,ES,PT,IT,KR,JP,BR|V6@2011-2025|L=112
Chevrolet|Tracker|suvP|135000|BR,AR,MX|LT@2020-2025,Premier@2020-2025
Chevrolet|Equinox|suv|230000|MX,US,CA,BR,AR|Premier@2018-2025
Chevrolet|Tahoe|suv|450000|US,CA,MX|LT@2015-2025,High Country*1.3@2021-2025|L=118,yR=14,roof=44,rack=1
Chevrolet|Trailblazer|suv|280000|BR,AR,IN,MX|LTZ@2013-2024|L=112,yR=15
Hyundai|Creta|suvP|130000|BR,IN,AR,MX|Action@2017-2025,Platinum@2017-2025,Ultimate*1.1@2022-2025
Hyundai|Tucson|suv|180000|KR,*|GLS@2010-2025
Hyundai|Santa Fe|suv|300000|KR,US,CA,BR,MX,ES,DE,GB|3.5 V6@2013-2025|L=110
Kia|Sportage|suv|200000|KR,*|LX@2011-2025,EX@2011-2025
Kia|Sorento|suv|280000|KR,US,CA,BR,MX|EX@2011-2025|L=110
Kia|Seltos|suvP|120000|IN,KR,US,CA,MX|HTX@2019-2025
Toyota|Corolla Cross|suvP|170000|BR,AR,MX,US,CA,JP|XRE@2022-2025,XRX Hybrid*1.15@2022-2025
Toyota|RAV4|suv|240000|JP,*|XLE@2013-2025,Hybrid*1.1@2019-2025
Toyota|SW4|suv|380000|AR,BR,IN|SRX@2016-2025,GR-Sport*1.1@2022-2025|L=112,yR=14,yS=43,wr=10
Toyota|Land Cruiser|box|650000|JP,*|Prado@2010-2023,300*1.4@2022-2025|L=110,doors=4,ws=9,rack=1
Honda|HR-V|suvP|150000|JP,*|EX@2016-2025,Touring*1.15@2016-2025|bk=12
Honda|CR-V|suv|230000|JP,*|EXL@2012-2025
Nissan|Kicks|suvP|125000|MX,BR,AR,US,CA,IN|S@2017-2025,SL@2017-2025,Exclusive@2021-2025|top=#1F2329
Renault|Duster|suvP|115000|BR,AR,IN,FR,ES,PT,IT,DE,GB|Expression@2012-2025,Iconic@2021-2025|rack=1
Renault|Captur|suvP|125000|FR,BR,ES,PT,IT,DE,GB|Intense@2017-2025|top=#F2F3F5
Fiat|Pulse|suvP|110000|BR,AR|Drive@2022-2025,Abarth*1.35@2023-2025
Fiat|Fastback|evsuv|140000|BR,AR|Impetus@2023-2025,Abarth*1.2@2024-2025
Peugeot|2008|suvP|130000|FR,BR,AR,ES,PT,IT,DE,GB|Allure@2016-2025,GT*1.15@2020-2025
Peugeot|3008|suv|210000|FR,ES,PT,IT,DE,GB,BR,AR|Griffe@2017-2025
Citroën|C4 Cactus|suvP|110000|BR,AR,FR,ES,PT|Feel@2019-2023
Ford|EcoSport|suvP|95000|BR,AR,IN,MX,US,GB,DE,ES|SE@2013-2021,Titanium@2013-2021,Storm*1.1@2018-2021|spare=1
Ford|Bronco|box|450000|US,CA,MX,BR|Badlands@2021-2025,Wildtrak*1.1@2021-2025|doors=4,spare=1
Ford|Explorer|suv|330000|US,CA,MX,KR|XLT@2016-2025|L=114
Mitsubishi|Pajero|suv|260000|JP,BR,AR,AO,ES,PT|Full HPE@2010-2021,Sport@2010-2021|yR=14,spare=1
Mitsubishi|Outlander|suv|250000|JP,*|GT@2014-2025
Mitsubishi|ASX|suvP|130000|JP,BR,AR,ES,PT,GB|HPE@2011-2021
Suzuki|Jimny|box|150000|JP,IN,BR,ES,PT,DE,GB,IT,FR|Sierra@2019-2025|L=74,roof=30,hood=18,doors=2,spare=1
Suzuki|Vitara|suvP|140000|JP,*|4Sport@2016-2025
Land Rover|Defender|box|650000|GB,*|90@2020-2025,110*1.1@2020-2025|L=100,rack=1,spare=1,doors=4
Land Rover|Discovery Sport|suv|380000|GB,*|SE@2015-2025
Land Rover|Range Rover Evoque|evsuv|350000|GB,*|SE@2012-2025|yR=19
Mahindra|Scorpio-N|suv|90000|IN|Z8@2022-2025|yR=14
Mahindra|Thar|box|75000|IN|LX@2020-2025|L=86,doors=2,spare=1
Tata|Nexon|suvP|55000|IN|XZ+@2017-2025
Maruti Suzuki|Brezza|suvP|50000|IN|ZXi@2016-2025
Caoa Chery|Tiggo 5x|suvP|120000|BR,AR|Pro@2020-2025
Caoa Chery|Tiggo 7|suv|160000|BR,AR|Pro@2021-2025
Caoa Chery|Tiggo 8|suv|200000|BR,AR|TXS@2021-2025|L=112
BYD|Song Plus|suv|230000|BR,MX|DM-i@2023-2025
GWM|Haval H6|suv|230000|BR,AR,MX|HEV@2022-2025
Mazda|CX-5|suv|230000|JP,*|Touring@2017-2025
Subaru|Forester|suv|220000|JP,US,CA,GB,DE,ES|XT@2014-2025|rack=1
Seat|Arona|suvP|130000|ES,PT,DE,IT,FR,GB|FR@2018-2025
Skoda|Kodiaq|suv|220000|DE,ES,PT,IT,FR,GB|Style@2017-2025
Opel|Mokka|suvP|150000|DE,ES,PT,IT,FR|Elegance@2021-2025`,
'Picapes e utilitários':`Fiat|Strada|pickP|105000|BR,AR|Working@2014-2025,Freedom@2021-2025,Volcano@2021-2025,Ranch*1.1@2023-2025
Fiat|Toro|pick|165000|BR,AR|Endurance@2017-2025,Freedom@2017-2025,Volcano@2017-2025,Ultra*1.2@2020-2025|L=110,yR=19,yS=45,wr=9
Volkswagen|Saveiro|pickP|95000|BR,AR|Robust@2017-2023,Cross@2010-2023
Volkswagen|Amarok|pick|280000|AR,BR,DE,GB,ES,PT,AO,MX|Trendline@2011-2017,Highline V6*1.3@2018-2025
Chevrolet|S10|pick|250000|BR,AR,MX|LT@2012-2025,High Country@2017-2025,Z71@2022-2025
Chevrolet|Montana|pickP|130000|BR,AR|Sport@2011-2020,LTZ@2023-2025
Chevrolet|Silverado|pick|420000|US,CA,MX,BR|LT@2014-2025,High Country*1.3@2019-2025|L=122,yR=14
Ford|Ranger|pick|260000|AR,*|XLS@2013-2025,Limited@2013-2025,Raptor*1.6@2019-2025
Ford|F-150|pick|400000|US,CA,MX,BR|XL@2015-2025,Lariat@2015-2025,Raptor*1.6@2017-2025|L=122,yR=14
Ford|Maverick|pick|230000|MX,US,CA,BR|Lariat@2022-2025,Tremor*1.1@2023-2025|L=110,yR=18
Toyota|Hilux|pick|280000|AR,BR,JP,MX,AO,IN,PT,ES,GB,DE,FR,IT|SR@2012-2025,SRV@2012-2025,GR-Sport*1.2@2020-2025
Toyota|Tacoma|pick|300000|US,CA,MX|TRD Off-Road@2016-2025
Toyota|Tundra|pick|420000|US,CA,MX|SR5@2014-2025|L=122,yR=14
Nissan|Frontier|pick|250000|MX,*|S@2017-2025,Attack@2017-2025,PRO-4X@2022-2025
Mitsubishi|L200 Triton|pick|240000|JP,BR,AR,AO,ES,PT,GB,DE,IT|Savana@2017-2025,Sport HPE@2017-2025
RAM|1500|pick|450000|US,CA,MX,BR|Laramie@2015-2025,Rebel@2015-2025,TRX*1.8@2021-2024|L=122,yR=14
RAM|2500|pick|520000|US,CA,MX,BR|Laramie@2015-2025|L=124,yR=13,wr=10.5
RAM|Rampage|pickP|240000|BR,AR|Rebel@2024-2025|L=108,yR=19
Renault|Oroch|pickP|120000|BR,AR|Outsider@2016-2025|yR=19
Fiat|Fiorino|van|95000|BR,AR|Endurance@2014-2025|L=92,yR=14,hood=18,ws=9,roof=58
Mercedes-Benz|Sprinter|van|300000|DE,*|416@2013-2025|L=118,yR=8
Ford|Transit|van|260000|US,*|350@2014-2025|L=116,yR=9
Fiat|Ducato|van|240000|IT,BR,FR,ES,PT,DE|Cargo@2018-2025|L=116,yR=9`,
'Esportivos':`Porsche|911|p911|1100000|DE,*|Carrera@2016-2025,Carrera S*1.15@2016-2025,Turbo S*1.8@2016-2025,GT3*1.5@2018-2025|round=1
Porsche|718 Cayman|super|650000|DE,*|S@2017-2025,GT4*1.4@2020-2025|L=96,roof=12
Chevrolet|Camaro|muscle|500000|US,CA,MX,BR,KR|SS@2016-2024,ZL1*1.4@2017-2024
Chevrolet|Corvette|super|750000|US,CA,MX,BR,JP|Stingray@2020-2025,Z06*1.6@2023-2025
Ford|Mustang|muscle|520000|US,*|GT@2015-2025,Mach 1*1.15@2021-2023,Shelby GT500*1.6@2020-2022|stripe=1
Dodge|Challenger|muscle|450000|US,CA,MX|R/T@2015-2023,SRT Hellcat*1.6@2015-2023|L=114,stripe=1
Dodge|Charger|sedan|420000|US,CA,MX|Scat Pack@2015-2023|L=116,yR=22
Nissan|GT-R|cupe|900000|JP,*|Premium@2012-2025,Nismo*1.8@2015-2025|spoiler=1
Nissan|370Z|cupe|300000|JP,*|Nismo@2012-2020|L=98,bk=22
Toyota|GR Supra|cupe|480000|JP,*|3.0@2020-2025|L=100,bk=22,round=1
Toyota|GR86|cupe|250000|JP,US,CA,DE,GB|Premium@2022-2025|L=100
Mazda|MX-5|roadster|300000|JP,*|Club@2016-2025
Honda|Civic Type R|hatch|430000|JP,*|FK8@2017-2021,FL5@2023-2025|spoiler=1,L=104
Subaru|WRX STI|sedan|350000|JP,US,CA,GB,BR|STI@2015-2021|spoiler=1,scoop=1
BMW|M3|sedan|800000|DE,*|Competition@2015-2025
BMW|M4|cupe|850000|DE,*|Competition@2015-2025
BMW|Z4|roadster|500000|DE,*|M40i@2019-2025|L=98
Mercedes-AMG|GT|cupe|1100000|DE,*|S@2015-2021|hood=44,ws=14,roof=10
Audi|R8|super|1300000|DE,*|V10@2016-2023
Audi|TT RS|cupe|560000|DE,*|Coupé@2016-2023|round=1,L=96
Ferrari|488 GTB|super|2400000|IT,*|Coupé@2016-2019
Ferrari|F8 Tributo|super|2800000|IT,*|Coupé@2020-2023
Ferrari|296 GTB|super|3000000|IT,*|Coupé@2022-2025
Ferrari|Roma|cupe|2200000|IT,*|Coupé@2021-2025|hood=42
Lamborghini|Huracán|super|3200000|IT,*|EVO@2020-2024,STO*1.3@2021-2024|yR=29
Lamborghini|Aventador|super|5000000|IT,*|S@2017-2022,SVJ*1.4@2019-2022|yR=29,L=112
McLaren|720S|super|3500000|GB,*|Coupé@2018-2023
Alpine|A110|cupe|450000|FR,ES,PT,IT,DE,GB,JP|Pure@2018-2025|L=94,round=1
Aston Martin|Vantage|cupe|1600000|GB,*|V8@2018-2025|hood=40
Bugatti|Chiron|super|20000000|FR,*|Sport@2018-2022|L=112`,
'Luxo e executivos':`Mercedes-Benz|Classe C|sedan|330000|DE,*|C 200@2015-2025,C 300*1.2@2015-2025
Mercedes-Benz|Classe E|sedan|480000|DE,*|E 300@2017-2025|L=114
Mercedes-Benz|Classe S|limo|1100000|DE,*|S 500@2014-2025,Maybach S 680*2.4@2021-2025
Mercedes-Benz|Classe G|box|1500000|DE,*|G 500@2018-2025,G 63 AMG*1.4@2018-2025|L=100,ws=4,doors=4,spare=1
BMW|Série 3|sedan|320000|DE,*|320i@2013-2025,330e*1.2@2019-2025
BMW|Série 5|sedan|520000|DE,*|530i@2017-2025|L=114
BMW|Série 7|limo|1000000|DE,*|740i@2016-2025
BMW|X5|suv|700000|US,*|xDrive45e@2019-2025,M Competition*1.6@2020-2025|L=112
Audi|A4|sedan|300000|DE,*|Prestige@2016-2025
Audi|A6|sedan|500000|DE,*|Performance@2019-2025|L=114
Audi|Q7|suv|650000|DE,*|Performance@2016-2025|L=114
Volvo|XC60|suv|420000|*|T8@2018-2025
Volvo|XC90|suv|600000|*|T8@2016-2025|L=114
Lexus|ES|sedan|400000|JP,*|300h@2019-2025|L=114
Lexus|LX|suv|1100000|JP,*|600@2022-2025|L=116,yR=14
Rolls-Royce|Ghost|limo|4000000|GB,*|Ghost@2021-2025
Rolls-Royce|Phantom|limo|5500000|GB,*|Phantom@2018-2025|L=122,yR=18
Rolls-Royce|Cullinan|suv|4500000|GB,*|Cullinan@2019-2025|L=116,yR=13
Bentley|Continental GT|cupe|2500000|GB,*|V8@2019-2025|L=108,hood=38
Bentley|Bentayga|suv|2600000|GB,*|V8@2016-2025|L=114
Porsche|Cayenne|suv|750000|DE,*|E-Hybrid@2018-2025,Turbo*1.6@2018-2025|bk=12
Porsche|Panamera|fast|900000|DE,*|4@2017-2025|L=116
Maserati|Ghibli|sedan|700000|IT,*|S@2014-2023|L=114
Maserati|Levante|suv|800000|IT,*|S@2017-2023|bk=12
Genesis|G80|sedan|400000|KR,US,CA|2.5T@2021-2025|L=116
Lincoln|Navigator|suv|700000|US,CA,MX|Reserve@2018-2025|L=120,yR=13,roof=46
Cadillac|Escalade|suv|800000|US,CA,MX|Platinum@2015-2025|L=120,yR=13,roof=46
Land Rover|Range Rover|suv|1300000|GB,*|Vogue@2013-2025,Sport*.8@2014-2025|L=116,yR=14,rack=1`,
'Elétricos':`Tesla|Model 3|ev|300000|US,*|Standard@2019-2025,Long Range*1.2@2019-2025,Performance*1.4@2019-2025
Tesla|Model S|ev|650000|US,*|Long Range@2016-2025,Plaid*1.3@2021-2025|L=116
Tesla|Model Y|evsuv|350000|US,*|Long Range@2020-2025,Performance*1.2@2020-2025
Tesla|Model X|evsuv|700000|US,*|Plaid@2021-2025|L=114
Tesla|Cybertruck|cyber|650000|US,CA|AWD@2024-2025,Cyberbeast*1.3@2024-2025
BYD|Dolphin|hatch|150000|BR,MX,ES,PT,DE,GB,FR,IT,JP,AR,KR,IN|GS@2023-2025,Mini*.7@2024-2025|L=92,roof=30,bk=12
BYD|Seal|ev|300000|BR,MX,ES,PT,DE,GB,FR,IT,JP,AR,KR,IN|AWD@2023-2025
BYD|Yuan Plus|evsuv|230000|BR,MX,IN,ES,PT,DE,GB,FR,IT,JP|EV@2023-2025
BYD|Han|ev|500000|BR,MX|EV@2022-2025|L=114
Nissan|Leaf|hatch|280000|JP,*|SL@2018-2025|L=96
Renault|Kwid E-Tech|hatchP|140000|BR|E-Tech@2023-2025|L=82,yR=19,yS=45
Renault|Zoe|hatchP|200000|FR,ES,PT,IT,DE,GB,BR|Intens@2013-2024|L=88,round=1
Chevrolet|Bolt EV|hatch|280000|US,CA,BR,MX,KR|Premier@2017-2023,EUV*1.05@2022-2023|yR=18
Volkswagen|ID.3|hatch|250000|DE,FR,ES,PT,IT,GB|Pro@2020-2025
Volkswagen|ID.4|evsuv|300000|DE,FR,ES,PT,IT,GB,US,CA|Pro@2021-2025
Hyundai|Ioniq 5|hatch|380000|KR,*|Long Range@2021-2025|L=104,yR=18,roof=36,bk=6
Hyundai|Ioniq 6|ev|400000|KR,*|Long Range@2023-2025|bk=28,roof=14
Kia|EV6|evsuv|400000|KR,*|GT-Line@2022-2025,GT*1.3@2023-2025|yR=20
Porsche|Taycan|ev|800000|DE,*|4S@2020-2025,Turbo S*1.6@2020-2025|yR=24
Audi|e-tron GT|ev|800000|DE,*|quattro@2021-2025|yR=24
Audi|Q8 e-tron|evsuv|600000|DE,*|55 quattro@2019-2025
BMW|i4|ev|450000|DE,*|eDrive40@2022-2025
BMW|iX|evsuv|700000|DE,*|xDrive50@2022-2025|L=110
Mercedes-Benz|EQS|ev|1000000|DE,*|450+@2022-2025|L=116
Ford|Mustang Mach-E|evsuv|450000|MX,*|Premium@2021-2025,GT*1.2@2021-2025
Volvo|EX30|evsuv|230000|*|Twin Motor@2024-2025|L=94
Fiat|500e|mini|220000|IT,FR,ES,PT,DE,GB,BR,US|Icon@2021-2025|L=80,round=1
Peugeot|e-208|hatch|220000|FR,ES,PT,IT,DE,GB,BR,AR|GT@2020-2025|L=90
Mini|Cooper SE|mini|260000|GB,*|SE@2020-2025|top=#F2C230,round=1
Rivian|R1T|pick|600000|US,CA|Adventure@2022-2025|L=116,yR=16
Lucid|Air|ev|800000|US,CA|Grand Touring@2022-2025|L=116
Tata|Nexon EV|suvP|80000|IN|Max@2020-2025`,
'Clássicos e antigos':`Volkswagen|Fusca|fusca|45000|BR,AR,MX,DE|1500@1971,1300@1975,1600@1983,Itamar 1600@1994
Volkswagen|Kombi|kombi|90000|BR,AR,DE,MX|Standard@1976,Last Edition*2@2013|top=#F2F3F5
Volkswagen|Brasília|hatchP|30000|BR|LS@1980|L=86,yR=20,box=1,chrome=1
Volkswagen|Gol GTI|hatchP|90000|BR|2.0@1994|L=86,spoiler=1
Volkswagen|Golf GTI|hatchP|120000|DE,*|Mk1@1979|L=84,box=1,round=1
Volkswagen|SP2|cupe|150000|BR|SP2@1973|chrome=1,round=1
Chevrolet|Opala|antigo|80000|BR|SS 4100@1976,Comodoro@1979,Diplomata@1988|stripe=0
Chevrolet|Chevette|antigo|35000|BR|SL@1983,DL@1990|L=96,hood=28
Chevrolet|Caravan|antigo|70000|BR|Diplomata@1990|bk=4,roof=38
Chevrolet|D20|pick|110000|BR|Custom@1994|L=118,yR=15,box=1,chrome=1
Chevrolet|Bel Air|antigo|350000|US,CA,MX|Bel Air@1957|L=118,stripe=1
Chevrolet|Impala|antigo|300000|US,CA,MX|SS@1964|L=118
Chevrolet|Camaro|muscle|450000|US,CA|SS@1969|chrome=1
Ford|Maverick|muscle|150000|BR|GT 302@1975|chrome=1,stripe=1
Ford|Corcel II|antigo|30000|BR|L@1980|L=100
Ford|Galaxie|antigo|120000|BR|Landau@1979|L=122
Ford|Mustang|muscle|600000|US,*|Fastback@1967|bk=24,chrome=1
Ford|Model T|antigo|250000|US,CA,GB|Touring@1925|L=88,yR=14,hood=24,ws=4,roof=30,bk=2,yB=32,wr=10
Ford|F-1000|pick|120000|BR|XLT@1990|L=118,yR=15,box=1
Fiat|147|hatchP|35000|BR|L@1978|L=80,box=1
Fiat|Uno Mille|hatchP|30000|BR|Mille@1995|L=84,box=1
Fiat|500|mini|130000|IT|L@1968|L=70,round=1,chrome=1,yR=22
Dodge|Charger|muscle|700000|US,CA|R/T@1970|chrome=1
Puma|GTE|cupe|150000|BR|GTE@1976|L=92,round=1
Gurgel|X-12|box|60000|BR|TR@1980|L=78,doors=2,spare=1
Willys|Jeep CJ-5|box|90000|BR,US|CJ-5@1965|L=80,doors=0,round=1,spare=1
Willys|Rural|suv|60000|BR|Rural@1968|L=100,chrome=1,round=1
Toyota|Bandeirante|box|130000|BR|OJ55@1990|L=96,round=1,doors=2
Toyota|2000GT|cupe|5000000|JP,*|2000GT@1967|round=1,chrome=1
Toyota|Corolla AE86|hatch|180000|JP|Trueno@1986|L=96,box=1
Nissan|Skyline GT-R|cupe|1500000|JP,GB|R34@1999|spoiler=1,round=1
Datsun|240Z|cupe|300000|JP,US|240Z@1971|bk=22,round=1,chrome=1
Honda|NSX|super|900000|JP,*|NA1@1991
Mazda|RX-7|cupe|400000|JP,US|FD@1993|bk=22
Porsche|911|p911|900000|DE,*|Carrera RS@1973|round=1,chrome=1
Porsche|356|fusca|900000|DE,*|Speedster@1958|chrome=1,roof=14,yR=24
Mercedes-Benz|300 SL|cupe|8000000|DE,*|Gullwing@1955|chrome=1,round=1
Jaguar|E-Type|cupe|1500000|GB,*|Series 1@1965|hood=46,round=1,chrome=1
Mini|Cooper|mini|200000|GB,*|Mk1@1965|L=70,top=#F2F3F5,round=1,chrome=1
Ferrari|Testarossa|super|1500000|IT,*|Testarossa@1986|stripe=0
Ferrari|F40|super|12000000|IT,*|F40@1990|spoiler=1
Lamborghini|Countach|super|3000000|IT,*|LP5000 QV@1985|spoiler=1
DeLorean|DMC-12|super|600000|US,GB|DMC-12@1981|box=1
Citroën|2CV|fusca|80000|FR|Charleston@1975|top=#1F2329,round=1
Renault|4|hatchP|50000|FR,ES,PT|GTL@1980|box=1,round=1,yR=18
Peugeot|205 GTI|hatchP|120000|FR|1.9@1987|box=1
BMW|2002|antigo|200000|DE,*|tii@1972|L=98,round=1,chrome=1
Hindustan|Ambassador|antigo|40000|IN|Classic@1995|L=100,round=1,chrome=1
Aston Martin|DB5|cupe|6000000|GB,*|DB5@1964|chrome=1,round=1,hood=40
Volkswagen|Passat|fast|40000|BR|TS@1978|L=98,box=1
Chevrolet|Monza|sedanP|35000|BR|SL/E@1986|box=1
Ford|Escort|hatchP|45000|BR,AR|XR3@1990|spoiler=1
Fiat|Tempra|sedan|35000|BR|Turbo@1994|box=1
Alfa Romeo|Spider|roadster|180000|IT,*|Veloce@1978|chrome=1,round=1
Lancia|Delta|hatchP|500000|IT,*|HF Integrale@1992|box=1,spoiler=1`};
const VEIC4_META={'Hatches e compactos':140,'Sedãs':115,'SUVs e crossovers':170,'Picapes e utilitários':100,'Esportivos':85,'Luxo e executivos':65,'Elétricos':65,'Clássicos e antigos':60};
const VEIC4_ORIGEM={Volkswagen:'DE',Fiat:'IT',Chevrolet:'US',Ford:'US',Renault:'FR',Peugeot:'FR','Citroën':'FR',Toyota:'JP',Honda:'JP',Hyundai:'KR',Kia:'KR',Nissan:'JP',Suzuki:'JP','Maruti Suzuki':'IN',Tata:'IN',Mahindra:'IN',Mini:'GB','Mercedes-Benz':'DE','Mercedes-AMG':'DE',BMW:'DE',Audi:'DE',Porsche:'DE',Seat:'ES',Opel:'DE',Skoda:'DE',Jeep:'US',Mitsubishi:'JP','Land Rover':'GB','Caoa Chery':'BR',BYD:'CN',GWM:'CN',Mazda:'JP',Subaru:'JP',RAM:'US',Dodge:'US',Ferrari:'IT',Lamborghini:'IT',McLaren:'GB',Alpine:'FR','Aston Martin':'GB',Bugatti:'FR',Volvo:'SE',Lexus:'JP','Rolls-Royce':'GB',Bentley:'GB',Maserati:'IT',Genesis:'KR',Lincoln:'US',Cadillac:'US',Tesla:'US',Rivian:'US',Lucid:'US',Puma:'BR',Gurgel:'BR',Willys:'BR',Datsun:'JP',Jaguar:'GB',DeLorean:'US',Hindustan:'IN','Alfa Romeo':'IT',Lancia:'IT'};
const VEIC4_EUROPA=['DE','FR','IT','ES','PT','GB','SE'];
// formas: comprimento, capô, para-brisa, teto, vidro traseiro, alturas (teto, cintura, bico, porta-malas, soleira), roda, portas
const VEIC4_FORMA={
 hatch:{L:94,hood:26,ws:14,bk:8,yR:21,yB:33,yN:37,yD:30,yS:47,wr:8.2,doors:4,deck:3,cp:6},
 hatchP:{L:86,hood:22,ws:13,bk:7,yR:21,yB:33,yN:37,yD:30,yS:47,wr:7.8,doors:4,deck:3,cp:5},
 sedan:{L:108,hood:29,ws:15,bk:13,yR:21,yB:33,yN:37,yD:32,yS:47,wr:8.4,doors:4,deck:19},
 sedanP:{L:102,hood:27,ws:14,bk:12,yR:21,yB:33,yN:37,yD:32,yS:47,wr:8,doors:4,deck:17},
 fast:{L:108,hood:28,ws:16,bk:22,yR:21,yB:33,yN:37,yD:33,yS:47,wr:8.4,doors:4,deck:7},
 suv:{L:104,hood:26,ws:13,bk:6,yR:16,yB:31,yN:34,yD:27,yS:44,wr:9.4,doors:4,deck:3,cp:4},
 suvP:{L:96,hood:25,ws:13,bk:8,yR:18,yB:32,yN:35,yD:29,yS:45,wr:8.8,doors:4,deck:3,cp:5},
 evsuv:{L:100,hood:25,ws:15,bk:20,yR:18,yB:32,yN:36,yD:31,yS:45,wr:9,doors:4,deck:4,cp:4},
 box:{L:92,hood:22,ws:7,bk:1,yR:15,yB:30,yN:31,yD:17,yS:43,wr:9.8,doors:4,deck:1,cp:2},
 pick:{L:116,hood:30,ws:12,bk:2,yR:17,yB:31,yN:33,yD:31,yS:44,wr:9.6,doors:4,bed:1,deck:36},
 pickP:{L:104,hood:26,ws:13,bk:3,yR:20,yB:33,yN:36,yD:33,yS:47,wr:8.4,doors:2,bed:1,deck:32},
 van:{L:110,hood:12,ws:10,bk:1,yR:10,yB:27,yN:30,yD:12,yS:45,wr:8.6,doors:2,van:1,deck:1},
 cupe:{L:104,hood:36,ws:16,bk:18,yR:24,yB:34,yN:38,yD:33,yS:47,wr:8.6,doors:2,deck:12},
 p911:{L:98,hood:26,ws:15,bk:32,yR:23,yB:34,yN:39,yD:38,yS:47,wr:8.6,doors:2,deck:3},
 super:{L:108,hood:30,ws:22,bk:30,yR:28,yB:37,yN:42,yD:36,yS:48,wr:8.8,doors:2,intake:1,deck:9},
 muscle:{L:110,hood:38,ws:15,bk:16,yR:23,yB:33,yN:35,yD:32,yS:47,wr:8.8,doors:2,deck:17},
 roadster:{L:92,hood:34,ws:10,bk:6,yR:27,yB:35,yN:39,yD:34,yS:47,wr:8.2,doors:2,open:1,deck:18},
 ev:{L:106,hood:24,ws:21,bk:22,yR:21,yB:34,yN:39,yD:33,yS:47,wr:8.6,doors:4,deck:10},
 limo:{L:118,hood:32,ws:15,bk:14,yR:20,yB:33,yN:36,yD:32,yS:47,wr:8.8,doors:4,deck:21},
 antigo:{L:110,hood:36,ws:10,bk:10,yR:21,yB:34,yN:35,yD:33,yS:46,wr:8,doors:4,chrome:1,deck:22},
 mini:{L:80,hood:16,ws:12,bk:4,yR:20,yB:33,yN:36,yD:29,yS:46,wr:7.6,doors:2,deck:2,cp:3},
 fusca:{L:90,yR:17,yS:46,wr:8,doors:2,round:1},
 kombi:{L:96,yR:11,yS:45,wr:8.2,doors:2},
 cyber:{L:118,yR:15,yS:43,wr:9.8,doors:4}
};
const VEIC4_COR={preto:'#1F2329',branco:'#EEF0F3',prata:'#B9BFC8',vermelho:'#C8302A',azul:'#2B63C4','azul-marinho':'#1F3458',verde:'#3E7A4C','verde-musgo':'#4F6B3A',amarelo:'#E9B728',cinza:'#6B717B','cinza-grafite':'#43484F',vinho:'#6E1D2E',laranja:'#E47A23',bege:'#CDB892',marrom:'#6A4630'};
const v4Slug=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
// catálogo: cada categoria pega as combinações versão × ano dos modelos em rodízio até fechar a conta
const VEICULOS4=[], VEIC4={};
(()=>{ for(const [cat,txt] of Object.entries(VEIC4_TXT)){ const modelos=txt.trim().split('\n').map(l=>{ const [b,m,f,v,mk,vs,aj]=l.split('|'); const o={};
    (aj||'').split(',').filter(Boolean).forEach(x=>{ const [k,val]=x.split('='); o[k]=val==null?1:(isNaN(+val)?val:+val); });
    const combos=[]; vs.split(',').forEach(x=>{ const mm=x.match(/^(.+?)(?:\*([\d.]+))?@(\d{4})(?:-(\d{4}))?$/); if(!mm) return; const a0=+mm[3], a1=+(mm[4]||mm[3]); const anos=[];
      for(let y=a1;y>=a0;y--) anos.push(y); const ord=[]; let i=0,j=anos.length-1; while(i<=j){ ord.push(anos[i++]); if(i<=j) ord.push(anos[j--]); }
      ord.forEach((y,k)=>combos.push({ver:mm[1],mult:+(mm[2]||1),ano:y,k})); });
    combos.sort((a,b)=>a.k-b.k);
    return {b,m,f,v:+v,mk:mk.split(','),o,combos}; });
    const alvo=VEIC4_META[cat]; let n=0, rodada=0;
    while(n<alvo&&modelos.some(md=>md.combos.length>rodada)){ for(const md of modelos){ if(n>=alvo) break; const c=md.combos[rodada]; if(!c) continue;
      const id=v4Slug(`${md.b}_${md.m}_${c.ver}_${c.ano}`); if(VEIC4[id]) continue;
      const r={id,cat,marca:md.b,modelo:md.m,versao:c.ver,ano:c.ano,forma:md.f,preco:Math.round(md.v*c.mult/100)*100,mk:md.mk,o:md.o,origem:VEIC4_ORIGEM[md.b]||md.mk[0],classico:cat==='Clássicos e antigos'};
      VEICULOS4.push(r); VEIC4[id]=r; n++; } rodada++; } } })();
const v4Nome=r=>`${r.marca} ${r.modelo} ${r.versao===r.modelo?'':r.versao+' '}${r.ano}`.replace(/\s+/g,' ').trim();

// ---------- desenho: perfil com degradê na lataria, vidros com reflexo, rodas com aro e sombra ----------
// 40 mais vendidos com as medidas reais (1 m = 23,3 unidades): comprimento, altura, entre-eixos, balanço e rodas,
// e os traços de cada um: faróis, lanternas, subida da janela, coluna escura, frisos e calotas
const V4_MOD={
'Volkswagen Gol':{L:91,yR:21,yB:33,yN:36.5,yD:30,yS:47.5,hood:22,ws:15,bk:11.0,deck:2,wb:.635,of:.18,wr:7.4,head:'big',tail:'vert',rim:'calota',lin:[3,2]},
'Chevrolet Onix':{L:97,yR:21,yB:32.5,yN:37,yD:30.5,yS:47.5,hood:24,ws:17,bk:14.0,deck:2,wb:.61,of:.19,wr:7.6,head:'slim',tail:'wrap',kick:3,q3:4,lin:[4,1.5],rsp:1},
'Hyundai HB20':{L:92,yR:21,yB:32.5,yN:37,yD:30,yS:47.5,hood:23,ws:17,bk:13.0,deck:2,wb:.64,of:.17,wr:7.5,head:'swept',tail:'wrap',kick:2.5,lin:[4.5,1],lin2:1,rsp:1},
'Volkswagen Polo':{L:95,yR:21,yB:33,yN:36.5,yD:30,yS:47.5,hood:23,ws:16,bk:12.0,deck:2,wb:.63,of:.18,wr:7.6,head:'slim',tail:'wrap',lin:[3,3],rsp:1},
'Fiat Mobi':{L:83,yR:20.3,yB:33,yN:36,yD:29,yS:47,hood:19,ws:13,bk:10.0,deck:1.5,wb:.645,of:.17,wr:7.2,head:'big',tail:'vert',rim:'calota',rsp:1},
'Fiat Argo':{L:93,yR:20.5,yB:32.5,yN:36.5,yD:30,yS:47,hood:23,ws:16,bk:13.0,deck:2,wb:.63,of:.18,wr:7.6,head:'swept',tail:'wrap',kick:2,rsp:1,lin2:1},
'Renault Kwid':{L:86,yR:20.5,yB:32,yN:35.5,yD:29.5,yS:45.5,hood:20,ws:14,bk:11.0,deck:2,wb:.66,of:.16,wr:7.4,head:'split',tail:'vert',rim:'calota',rack:1,plast:1},
'Fiat Uno':{L:88,yR:19.5,yB:33,yN:35.5,yD:22,yS:47,hood:19,ws:11,bk:2,deck:1,wb:.635,of:.17,wr:7.2,head:'big',tail:'vert',rim:'calota'},
'Fiat Palio':{L:89,yR:21.5,yB:33.5,yN:37,yD:30,yS:47.5,hood:22,ws:14,bk:12.0,deck:2,wb:.62,of:.18,wr:7.2,tail:'vert',rim:'calota'},
'Chevrolet Celta':{L:87,yR:22,yB:33.5,yN:37,yD:30,yS:47.5,hood:21,ws:14,bk:12.0,deck:2,wb:.65,of:.16,wr:7,head:'big',tail:'vert',rim:'calota'},
'Ford Ka':{L:91,yR:19.5,yB:33,yN:36.5,yD:30,yS:47,hood:22,ws:16,bk:12.0,deck:2,wb:.64,of:.17,wr:7.4,head:'swept',tail:'vert'},
'Ford Fiesta':{L:93,yR:20.5,yB:32,yN:37,yD:30,yS:47.5,hood:23,ws:17,bk:13.0,deck:2,wb:.63,of:.18,wr:7.6,head:'swept',tail:'vert',kick:3,lin:[5,.5]},
'Renault Sandero':{L:95,yR:19.5,yB:32.5,yN:36,yD:29.5,yS:47,hood:23,ws:15,bk:11.0,deck:2,wb:.64,of:.17,wr:7.6,head:'big',tail:'vert',kick:1.5},
'Peugeot 208':{L:95,yR:21.2,yB:32.5,yN:37,yD:30.5,yS:47.5,hood:25,ws:17,bk:14.0,deck:2,wb:.625,of:.18,wr:7.8,head:'split',tail:'bar',lin2:1},
'Volkswagen Golf':{L:99,yR:21,yB:33,yN:36.5,yD:30,yS:47.5,hood:25,ws:16,bk:10.0,deck:2,wb:.62,of:.19,wr:7.8,head:'slim',tail:'wrap',lin:[3,3]},
'Toyota Corolla':{L:108,yR:21,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:28,ws:19,bk:15,deck:10,wb:.585,of:.2,wr:8,head:'slim',tail:'wrap',cj:1,lin:[4,2],q3:5},
'Honda Civic':{L:108,yR:21.6,yB:33,yN:38,yD:32.5,yS:47.5,hood:29,ws:20,bk:22,deck:5,wb:.58,of:.2,wr:8,head:'slim',tail:'bar',lin:[5,1],q3:6,cj:1},
'Chevrolet Onix Plus':{L:104,yR:21,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:24,ws:17,bk:15,deck:9,wb:.58,of:.18,wr:7.6,head:'slim',tail:'wrap',kick:2,q3:5,lin:[4,1.5]},
'Volkswagen Virtus':{L:104,yR:21,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:24,ws:17,bk:15,deck:10,wb:.59,of:.18,wr:7.6,head:'slim',tail:'wrap',lin:[3,3],q3:5,cj:1},
'Hyundai HB20S':{L:101,yR:21,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:23,ws:17,bk:15,deck:9,wb:.585,of:.17,wr:7.5,head:'swept',tail:'bar',kick:2.5,lin:[4.5,1]},
'Fiat Cronos':{L:101,yR:20,yB:32.5,yN:36.5,yD:31,yS:47,hood:23,ws:16,bk:13,deck:11,wb:.575,of:.18,wr:7.6,head:'swept',tail:'wrap',kick:2,q3:4},
'Nissan Versa':{L:105,yR:21,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:25,ws:18,bk:15,deck:10,wb:.58,of:.19,wr:7.6,head:'swept',tail:'wrap',blk:1,kick:2,lin:[4,2]},
'Volkswagen Jetta':{L:110,yR:21,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:29,ws:19,bk:16,deck:11,wb:.575,of:.2,wr:8,head:'slim',tail:'wrap',cj:1,q3:5,lin:[3,3]},
'Volkswagen T-Cross':{L:98,yR:18.5,yB:31.5,yN:35,yD:28,yS:45.5,hood:23,ws:15,bk:5,deck:2,wb:.63,of:.18,wr:8,head:'slim',tail:'bar',plast:1,q3:5,lin:[3,3]},
'Volkswagen Nivus':{L:100,yR:20.3,yB:32,yN:35.5,yD:30.5,yS:45.5,hood:24,ws:17,bk:18,deck:3,wb:.6,of:.18,wr:8,head:'slim',tail:'bar',plast:1,blk:1},
'Chevrolet Tracker':{L:100,yR:17.5,yB:31.5,yN:35,yD:28.5,yS:45,hood:24,ws:16,bk:7,deck:2,wb:.6,of:.19,wr:8,head:'split',tail:'wrap',plast:1,blk:1,kick:2},
'Hyundai Creta':{L:101,yR:17.5,yB:31,yN:35,yD:28.5,yS:45,hood:24,ws:15,bk:7,deck:2,wb:.6,of:.19,wr:8.2,head:'split',tail:'wrap',plast:1,blk:1,kick:2.5,rack:1},
'Jeep Renegade':{L:99,yR:15.6,yB:31,yN:33.5,yD:17,yS:45,hood:22,ws:10,bk:2,deck:1,wb:.605,of:.18,wr:8.2,round:1,tail:'x',plast:1,doors:4,spare:0},
'Jeep Compass':{L:102,yR:17,yB:31,yN:35,yD:28,yS:45,hood:25,ws:16,bk:7,deck:2,wb:.6,of:.19,wr:8.4,head:'slim',tail:'wrap',plast:1,blk:1,kick:2,cj:1},
'Nissan Kicks':{L:100,yR:18,yB:31.5,yN:35.5,yD:29,yS:45.5,hood:24,ws:16,bk:7,deck:2,wb:.61,of:.18,wr:8,head:'swept',tail:'wrap',plast:1,blk:1,kick:3},
'Honda HR-V':{L:100,yR:17.8,yB:31,yN:35.5,yD:29.5,yS:45.5,hood:24,ws:17,bk:12,deck:2,wb:.61,of:.18,wr:8,head:'slim',tail:'wrap',plast:1,kick:3.5,lin:[5,0]},
'Toyota Corolla Cross':{L:104,yR:17.3,yB:31,yN:35,yD:28.5,yS:45,hood:25,ws:17,bk:9,deck:2,wb:.59,of:.19,wr:8.4,head:'slim',tail:'wrap',plast:1,cj:1,kick:2,rack:1},
'Renault Duster':{L:102,yR:16.2,yB:30.5,yN:34,yD:27.5,yS:44.5,hood:24,ws:14,bk:6,deck:2,wb:.61,of:.18,wr:8.3,head:'big',tail:'vert',plast:1,rack:1},
'Ford EcoSport':{L:99,yR:16,yB:31,yN:34.5,yD:27,yS:44.5,hood:22,ws:14,bk:3,deck:1,wb:.595,of:.18,wr:8,head:'swept',tail:'vert',plast:1,spare:1,rack:1,kick:2},
'Fiat Strada':{L:104,yR:17.8,yB:31.5,yN:34.5,yD:31.5,yS:45,hood:25,ws:15,bk:2,deck:32,wb:.61,of:.17,wr:8,head:'split',tail:'vert',plast:1,santo:1,doors:4},
'Fiat Toro':{L:115,yR:14.5,yB:30.5,yN:32.5,yD:30.5,yS:44,hood:29,ws:15,bk:2,deck:34,wb:.61,of:.19,wr:8.6,head:'split',tail:'vert',plast:1,doors:4},
'Toyota Hilux':{L:122,yR:13,yB:29.5,yN:31.5,yD:29.5,yS:43,hood:30,ws:13,bk:2,deck:40,wb:.58,of:.17,wr:9,head:'slim',tail:'vert',plast:1,flare:1,doors:4},
'Chevrolet S10':{L:122,yR:13.3,yB:29.5,yN:31.5,yD:29.5,yS:43.5,hood:31,ws:13,bk:2,deck:40,wb:.58,of:.17,wr:9,head:'slim',tail:'vert',santo:1,doors:4},
'Ford Ranger':{L:122,yR:12.5,yB:29,yN:31,yD:29,yS:43,hood:32,ws:12,bk:2,deck:40,wb:.61,of:.16,wr:9.2,head:'big',tail:'vert',plast:1,flare:1,doors:4},
'Volkswagen Saveiro':{L:104,yR:20,yB:32.5,yN:36,yD:32.5,yS:46.5,hood:23,ws:15,bk:2,roof:14,deck:50,wb:.61,of:.17,wr:7.6,head:'slim',tail:'vert',doors:2,santo:1},
'Volkswagen up!':{L:84,yR:20,yB:33,yN:36,yD:29.5,yS:47,hood:18,ws:13,bk:9,deck:2,wb:.67,of:.15,wr:7.2,head:'big',tail:'vert'},
'Fiat 500':{L:83,yR:20.3,yB:33.5,yN:36.5,yD:30,yS:47,hood:17,ws:15,bk:10,deck:2,wb:.645,of:.16,wr:7.4,round:1,tail:'vert'},
'Chevrolet Corsa':{L:89,yR:21.5,yB:33.5,yN:37,yD:30,yS:47.5,hood:21,ws:15,bk:11,deck:2,wb:.65,of:.16,wr:7,head:'big',tail:'vert',rim:'calota'},
'Ford Focus':{L:102,yR:21.2,yB:33,yN:37,yD:30.5,yS:47.5,hood:27,ws:18,bk:12,deck:2,wb:.62,of:.19,wr:8,head:'swept',tail:'wrap',lin:[3,2]},
'Renault Clio':{L:94,yR:21.4,yB:32.5,yN:37,yD:30.5,yS:47.5,hood:24,ws:17,bk:12,deck:2,wb:.635,of:.18,wr:7.8,head:'slim',tail:'wrap',lin2:1,kick:2},
'Peugeot 206':{L:89,yR:21.7,yB:33,yN:37.5,yD:30.5,yS:47.5,hood:21,ws:17,bk:12,deck:2,wb:.64,of:.17,wr:7.2,head:'swept',tail:'vert'},
'Citroën C3':{L:93,yR:20.8,yB:32.5,yN:36,yD:29.5,yS:46.5,hood:22,ws:15,bk:8,deck:2,wb:.64,of:.17,wr:7.8,head:'split',tail:'vert',plast:1,top:'#F2F3F5',lin2:1},
'Toyota Yaris':{L:92,yR:20,yB:32.5,yN:37,yD:30,yS:47.5,hood:22,ws:17,bk:10,deck:2,wb:.645,of:.17,wr:7.6,head:'swept',tail:'vert',kick:2},
'Toyota Etios':{L:88,yR:19.8,yB:33,yN:36.5,yD:30,yS:47.5,hood:21,ws:15,bk:9,deck:2,wb:.65,of:.16,wr:7.2,head:'swept',tail:'vert',rim:'calota'},
'Honda Fit':{L:93,yR:19.4,yB:32.5,yN:37,yD:29.5,yS:47.5,hood:17,ws:21,bk:10,deck:1,wb:.635,of:.17,wr:7.6,head:'swept',tail:'vert',kick:3},
'Hyundai i30':{L:101,yR:21.2,yB:33,yN:37,yD:30.5,yS:47.5,hood:27,ws:18,bk:11,deck:2,wb:.61,of:.2,wr:8,head:'slim',tail:'wrap',lin:[3,2]},
'Hyundai Grand i10':{L:89,yR:19.6,yB:33,yN:36.5,yD:29.5,yS:47.5,hood:20,ws:15,bk:10,deck:2,wb:.645,of:.16,wr:7.2,head:'swept',tail:'vert',kick:1.5},
'Kia Picanto':{L:84,yR:20.4,yB:33,yN:36.5,yD:29.5,yS:47.5,hood:18,ws:15,bk:10,deck:2,wb:.665,of:.15,wr:7.4,head:'swept',tail:'vert',rsp:1},
'Nissan March':{L:88,yR:19.5,yB:33,yN:37,yD:30,yS:47.5,hood:19,ws:16,bk:11,deck:2,wb:.65,of:.16,wr:7.2,head:'swept',tail:'vert',rim:'calota',round:0},
'Suzuki Swift':{L:89,yR:20.2,yB:32.5,yN:36.5,yD:29.5,yS:47.5,hood:21,ws:15,bk:9,deck:2,wb:.64,of:.17,wr:7.4,head:'swept',tail:'vert',blk:1,kick:2},
'Maruti Suzuki Alto':{L:80,yR:20.5,yB:33.5,yN:36.5,yD:30,yS:47.5,hood:17,ws:13,bk:8,deck:2,wb:.69,of:.14,wr:6.8,head:'big',tail:'vert',rim:'calota'},
'Tata Nano':{L:72,yR:16.6,yB:31,yN:36,yD:27,yS:46.5,hood:10,ws:18,bk:6,deck:1,wb:.72,of:.12,wr:6.6,head:'big',tail:'vert',rim:'calota'},
'Mini Cooper':{L:89,yR:22.1,yB:33.5,yN:37,yD:30.5,yS:47.5,hood:19,ws:14,bk:5,deck:1,wb:.655,of:.16,wr:7.8,round:1,tail:'vert',doors:2},
'Mercedes-Benz Classe A':{L:103,yR:21.4,yB:33,yN:37,yD:30.5,yS:47.5,hood:27,ws:19,bk:13,deck:2,wb:.62,of:.19,wr:8.2,head:'slim',tail:'wrap',lin:[4,2]},
'BMW Série 1':{L:101,yR:21.7,yB:33,yN:37,yD:30.5,yS:47.5,hood:27,ws:18,bk:11,deck:2,wb:.62,of:.18,wr:8,head:'slim',tail:'wrap',kick:2},
'Audi A3 Sportback':{L:101,yR:21.7,yB:33,yN:37,yD:30.5,yS:47.5,hood:27,ws:18,bk:12,deck:2,wb:.61,of:.2,wr:8,head:'slim',tail:'wrap',lin:[3,3]},
'Seat Ibiza':{L:95,yR:21.4,yB:32.5,yN:37,yD:30.5,yS:47.5,hood:24,ws:17,bk:11,deck:2,wb:.63,of:.18,wr:7.6,head:'slim',tail:'wrap',lin:[3,1]},
'Seat Leon':{L:102,yR:21.2,yB:33,yN:37,yD:30.5,yS:47.5,hood:27,ws:18,bk:12,deck:2,wb:.615,of:.19,wr:8,head:'slim',tail:'bar',lin:[3,2]},
'Opel Corsa':{L:95,yR:21.7,yB:32.5,yN:37,yD:30.5,yS:47.5,hood:24,ws:17,bk:12,deck:2,wb:.625,of:.18,wr:7.6,head:'slim',tail:'wrap'},
'Skoda Fabia':{L:96,yR:21,yB:33,yN:37,yD:30.5,yS:47.5,hood:24,ws:17,bk:10,deck:2,wb:.625,of:.18,wr:7.6,head:'slim',tail:'wrap',lin:[3,3]},
'Honda City':{L:106,yR:20.5,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:26,ws:18,bk:16,deck:11,wb:.57,of:.19,wr:7.6,head:'slim',tail:'wrap',cj:1,q3:5},
'Honda Accord':{L:114,yR:21.2,yB:33,yN:37.5,yD:32,yS:47.5,hood:31,ws:21,bk:24,deck:7,wb:.58,of:.19,wr:8.2,head:'slim',tail:'wrap',q3:7,cj:1},
'Chevrolet Prisma':{L:100,yR:20.5,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:23,ws:16,bk:14,deck:11,wb:.59,of:.18,wr:7.4,head:'slim',tail:'wrap',kick:2,q3:4},
'Chevrolet Cruze':{L:109,yR:20.8,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:27,ws:19,bk:17,deck:10,wb:.58,of:.2,wr:8,head:'swept',tail:'wrap',cj:1,q3:6},
'Chevrolet Malibu':{L:115,yR:21,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:30,ws:21,bk:21,deck:9,wb:.575,of:.2,wr:8.2,head:'swept',tail:'wrap',cj:1,q3:7},
'Volkswagen Voyage':{L:98,yR:20.8,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:22,ws:15,bk:13,deck:12,wb:.585,of:.18,wr:7.4,head:'big',tail:'wrap',rim:'calota'},
'Volkswagen Passat':{L:111,yR:21,yB:33,yN:37,yD:32,yS:47.5,hood:29,ws:18,bk:15,deck:12,wb:.585,of:.19,wr:8.2,head:'slim',tail:'wrap',cj:1,q3:5,lin:[3,3]},
'Fiat Siena':{L:100,yR:19.8,yB:32.5,yN:36.5,yD:31,yS:47.5,hood:23,ws:16,bk:14,deck:11,wb:.585,of:.18,wr:7.4,head:'swept',tail:'wrap',q3:4},
'Ford Fusion':{L:113,yR:20.5,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:30,ws:21,bk:22,deck:8,wb:.585,of:.2,wr:8.2,head:'slim',tail:'wrap',cj:1,q3:6},
'Ford Ka Sedan':{L:99,yR:19.8,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:22,ws:16,bk:14,deck:11,wb:.585,of:.18,wr:7.4,head:'swept',tail:'wrap',q3:4},
'Hyundai Elantra':{L:109,yR:21.9,yB:33,yN:37.5,yD:32,yS:47.5,hood:28,ws:21,bk:22,deck:8,wb:.58,of:.19,wr:8,head:'slim',tail:'bar',lin:[5,0],lin2:1,q3:6,kick:2},
'Hyundai Sonata':{L:114,yR:21.3,yB:33,yN:37.5,yD:32,yS:47.5,hood:30,ws:22,bk:24,deck:7,wb:.58,of:.19,wr:8.2,head:'slim',tail:'bar',cj:1,q3:6},
'Kia Cerato':{L:108,yR:21.4,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:28,ws:19,bk:18,deck:10,wb:.58,of:.19,wr:8,head:'slim',tail:'wrap',q3:5},
'Nissan Sentra':{L:108,yR:21.2,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:28,ws:20,bk:20,deck:9,wb:.585,of:.19,wr:8,head:'swept',tail:'wrap',blk:1,kick:2},
'Toyota Camry':{L:114,yR:21.3,yB:33,yN:37.5,yD:32,yS:47.5,hood:30,ws:21,bk:20,deck:9,wb:.58,of:.19,wr:8.2,head:'slim',tail:'wrap',cj:1,q3:6},
'Toyota Etios Sedan':{L:102,yR:19.8,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:21,ws:15,bk:14,deck:13,wb:.585,of:.17,wr:7.2,head:'swept',tail:'wrap',rim:'calota'},
'Renault Logan':{L:101,yR:19.6,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:22,ws:15,bk:13,deck:12,wb:.6,of:.17,wr:7.4,head:'big',tail:'wrap'},
'Peugeot 408':{L:109,yR:20.3,yB:32.5,yN:37,yD:31.5,yS:47.5,hood:27,ws:18,bk:16,deck:12,wb:.58,of:.2,wr:7.8,head:'swept',tail:'wrap',cj:1},
'Mazda 3 Sedan':{L:109,yR:21.4,yB:33,yN:37.5,yD:32,yS:47.5,hood:31,ws:19,bk:17,deck:10,wb:.585,of:.19,wr:8,head:'slim',tail:'wrap',q3:5,cj:1},
'Maruti Suzuki Dzire':{L:93,yR:19.7,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:21,ws:15,bk:12,deck:9,wb:.61,of:.17,wr:7.2,head:'swept',tail:'wrap',cj:1},
'Tata Tigor':{L:93,yR:20.3,yB:33,yN:36.5,yD:31.5,yS:47.5,hood:21,ws:16,bk:14,deck:7,wb:.615,of:.17,wr:7.2,head:'swept',tail:'wrap'},
'Kia K5':{L:114,yR:21.3,yB:33,yN:37.5,yD:32,yS:47.5,hood:30,ws:22,bk:26,deck:6,wb:.58,of:.19,wr:8.2,head:'slim',tail:'bar',q3:7,cj:1},
'Jeep Commander':{L:111,yR:15.9,yB:30.5,yN:34,yD:27,yS:44.5,hood:27,ws:16,bk:6,deck:2,wb:.585,of:.19,wr:8.6,head:'slim',tail:'wrap',plast:1,blk:1,cj:1,rack:1},
'Jeep Grand Cherokee':{L:114,yR:13,yB:30,yN:33,yD:26.5,yS:44,hood:30,ws:15,bk:6,deck:2,wb:.6,of:.18,wr:9,head:'slim',tail:'wrap',cj:1,rack:1,blk:1},
'Jeep Wrangler':{L:97,yR:12.1,yB:30,yN:31,yD:15,yS:43,hood:22,ws:5,bk:1,deck:1,wb:.585,of:.15,wr:10,round:1,tail:'vert',plast:1,flare:1,spare:1,doors:2},
'Volkswagen Tiguan':{L:110,yR:16.1,yB:31,yN:34.5,yD:27.5,yS:44.5,hood:27,ws:15,bk:6,deck:2,wb:.595,of:.19,wr:8.6,head:'slim',tail:'wrap',cj:1,rack:1,plast:1},
'Volkswagen Taos':{L:104,yR:17,yB:31,yN:34.5,yD:28,yS:44.5,hood:26,ws:16,bk:6,deck:2,wb:.605,of:.19,wr:8.4,head:'slim',tail:'bar',plast:1,cj:1},
'Volkswagen Touareg':{L:114,yR:15.4,yB:30.5,yN:34,yD:27.5,yS:44.5,hood:30,ws:16,bk:7,deck:2,wb:.595,of:.19,wr:9,head:'slim',tail:'bar',cj:1},
'Chevrolet Equinox':{L:108,yR:16.3,yB:31,yN:34.5,yD:28,yS:44.5,hood:27,ws:16,bk:7,deck:2,wb:.585,of:.2,wr:8.6,head:'split',tail:'wrap',plast:1,kick:2,cj:1},
'Chevrolet Tahoe':{L:124,yR:10,yB:28.5,yN:31,yD:23,yS:42.5,hood:31,ws:14,bk:3,deck:1,wb:.575,of:.17,wr:9.8,head:'split',tail:'vert',rack:1,cj:1},
'Chevrolet Trailblazer':{L:114,yR:12,yB:29.5,yN:32.5,yD:25,yS:43,hood:29,ws:14,bk:5,deck:2,wb:.585,of:.17,wr:9.4,head:'slim',tail:'vert',rack:1,plast:1,kick:2},
'Hyundai Tucson':{L:105,yR:16.6,yB:31,yN:34.5,yD:28,yS:44.5,hood:26,ws:16,bk:8,deck:2,wb:.595,of:.19,wr:8.6,head:'split',tail:'bar',plast:1,kick:3,cj:1},
'Hyundai Santa Fe':{L:111,yR:15.9,yB:30.5,yN:34,yD:27.5,yS:44.5,hood:28,ws:15,bk:7,deck:2,wb:.585,of:.19,wr:8.8,head:'split',tail:'wrap',plast:1,rack:1,cj:1},
'Kia Sportage':{L:108,yR:16.3,yB:31,yN:34.5,yD:28,yS:44.5,hood:27,ws:17,bk:10,deck:2,wb:.59,of:.19,wr:8.6,head:'split',tail:'bar',plast:1,blk:1,kick:2},
'Kia Sorento':{L:112,yR:15.4,yB:30.5,yN:34,yD:27,yS:44.5,hood:28,ws:15,bk:6,deck:2,wb:.585,of:.19,wr:8.8,head:'slim',tail:'vert',plast:1,rack:1,cj:1},
'Kia Seltos':{L:101,yR:17.3,yB:31,yN:34.5,yD:28,yS:44.5,hood:25,ws:16,bk:7,deck:2,wb:.6,of:.19,wr:8.2,head:'split',tail:'bar',plast:1,blk:1,rack:1},
'Toyota RAV4':{L:107,yR:15.6,yB:31,yN:34,yD:27.5,yS:44.5,hood:26,ws:15,bk:7,deck:2,wb:.585,of:.19,wr:8.6,head:'slim',tail:'wrap',plast:1,flare:1,kick:2},
'Toyota SW4':{L:112,yR:12.1,yB:29.5,yN:32.5,yD:25,yS:43,hood:29,ws:14,bk:5,deck:2,wb:.57,of:.18,wr:9.4,head:'slim',tail:'vert',rack:1,cj:1},
'Toyota Land Cruiser':{L:116,yR:10,yB:28.5,yN:31,yD:23,yS:42.5,hood:30,ws:11,bk:3,deck:1,wb:.57,of:.18,wr:9.8,head:'slim',tail:'vert',rack:1,cj:1},
'Honda CR-V':{L:109,yR:15.6,yB:31,yN:34,yD:27.5,yS:44.5,hood:27,ws:16,bk:8,deck:2,wb:.575,of:.2,wr:8.6,head:'slim',tail:'vert',plast:1,cj:1},
'Renault Captur':{L:99,yR:18.2,yB:31.5,yN:35,yD:28.5,yS:45,hood:25,ws:16,bk:8,deck:2,wb:.625,of:.18,wr:8.2,head:'split',tail:'wrap',plast:1,kick:2},
'Fiat Pulse':{L:96,yR:18.2,yB:31.5,yN:35,yD:29,yS:45,hood:24,ws:16,bk:9,deck:2,wb:.615,of:.18,wr:8,head:'split',tail:'bar',plast:1,blk:1},
'Fiat Fastback':{L:103,yR:18.9,yB:31.5,yN:35,yD:30,yS:45,hood:25,ws:17,bk:20,deck:4,wb:.57,of:.18,wr:8.2,head:'split',tail:'bar',plast:1,blk:1},
'Peugeot 2008':{L:100,yR:18.9,yB:31.5,yN:35.5,yD:29,yS:45,hood:26,ws:17,bk:10,deck:2,wb:.605,of:.18,wr:8.2,head:'split',tail:'vert',plast:1,blk:1,kick:2},
'Peugeot 3008':{L:104,yR:17.3,yB:31,yN:34.5,yD:28,yS:44.5,hood:27,ws:16,bk:8,deck:2,wb:.6,of:.19,wr:8.6,head:'split',tail:'vert',plast:1,blk:1,cj:1},
'Citroën C4 Cactus':{L:97,yR:20.5,yB:32,yN:35.5,yD:29.5,yS:45.5,hood:24,ws:16,bk:9,deck:2,wb:.625,of:.18,wr:7.8,head:'split',tail:'wrap',plast:1,lin2:1},
'Ford Bronco':{L:112,yR:12,yB:30,yN:31,yD:15,yS:42.5,hood:25,ws:6,bk:1,deck:1,wb:.615,of:.15,wr:10,round:1,tail:'vert',plast:1,flare:1,spare:1,doors:4},
'Ford Explorer':{L:118,yR:13.5,yB:30,yN:33,yD:26,yS:43.5,hood:30,ws:16,bk:6,deck:2,wb:.6,of:.17,wr:9.2,head:'slim',tail:'vert',rack:1,cj:1,blk:1},
'Mitsubishi Pajero':{L:114,yR:10.7,yB:29,yN:32,yD:20,yS:42.5,hood:27,ws:12,bk:3,deck:1,wb:.57,of:.17,wr:9.6,head:'big',tail:'vert',spare:1,plast:1,flare:1},
'Mitsubishi Outlander':{L:110,yR:14.5,yB:30.5,yN:33.5,yD:27,yS:44,hood:28,ws:16,bk:7,deck:2,wb:.575,of:.19,wr:9,head:'split',tail:'vert',plast:1,cj:1,blk:1},
'Mitsubishi ASX':{L:100,yR:17,yB:31.5,yN:35,yD:28.5,yS:44.5,hood:25,ws:16,bk:8,deck:2,wb:.62,of:.18,wr:8.2,head:'slim',tail:'wrap',plast:1},
'Suzuki Jimny':{L:81,yR:15,yB:30,yN:31.5,yD:17,yS:43,hood:18,ws:6,bk:1,deck:1,wb:.645,of:.14,wr:9,round:1,tail:'vert',plast:1,flare:1,spare:1,doors:2},
'Suzuki Vitara':{L:97,yR:17.5,yB:31.5,yN:35,yD:28,yS:44.5,hood:25,ws:15,bk:6,deck:2,wb:.6,of:.18,wr:8.2,head:'slim',tail:'wrap',plast:1},
'Land Rover Defender':{L:116,yR:9.1,yB:29,yN:31,yD:15,yS:43,hood:24,ws:8,bk:1,deck:1,wb:.6,of:.16,wr:9.8,head:'big',tail:'vert',spare:1,rack:1,doors:4},
'Land Rover Discovery Sport':{L:107,yR:15,yB:30.5,yN:34,yD:27,yS:44.5,hood:27,ws:15,bk:5,deck:2,wb:.595,of:.18,wr:8.8,head:'slim',tail:'wrap',kick:3,blk:1,plast:1},
'Land Rover Range Rover Evoque':{L:102,yR:16.6,yB:31,yN:34.5,yD:28.5,yS:44.5,hood:27,ws:16,bk:12,deck:2,wb:.61,of:.18,wr:9,head:'slim',tail:'bar',kick:3,blk:1},
'Mahindra Scorpio-N':{L:108,yR:11.7,yB:29.5,yN:32.5,yD:24,yS:43,hood:27,ws:13,bk:4,deck:2,wb:.59,of:.17,wr:9.2,head:'big',tail:'vert',rack:1,plast:1,flare:1},
'Mahindra Thar':{L:93,yR:12.1,yB:30,yN:31.5,yD:16,yS:43,hood:22,ws:6,bk:1,deck:1,wb:.615,of:.14,wr:9.6,round:1,tail:'vert',plast:1,flare:1,spare:1,doors:2},
'Tata Nexon':{L:93,yR:17.3,yB:31.5,yN:35,yD:28.5,yS:45,hood:23,ws:16,bk:9,deck:2,wb:.625,of:.17,wr:8,head:'split',tail:'bar',plast:1,top:'#F2F3F5',kick:2},
'Maruti Suzuki Brezza':{L:93,yR:15.7,yB:31,yN:34.5,yD:27.5,yS:44.5,hood:23,ws:14,bk:5,deck:2,wb:.625,of:.17,wr:8,head:'split',tail:'wrap',plast:1,rack:1,blk:1},
'Caoa Chery Tiggo 5x':{L:101,yR:16.3,yB:31,yN:34.5,yD:28,yS:44.5,hood:25,ws:16,bk:8,deck:2,wb:.61,of:.18,wr:8.4,head:'slim',tail:'wrap',plast:1,blk:1},
'Caoa Chery Tiggo 7':{L:105,yR:15.4,yB:31,yN:34.5,yD:28,yS:44.5,hood:26,ws:16,bk:7,deck:2,wb:.59,of:.19,wr:8.6,head:'split',tail:'bar',plast:1,cj:1},
'Caoa Chery Tiggo 8':{L:110,yR:14.2,yB:30.5,yN:34,yD:27.5,yS:44,hood:27,ws:16,bk:6,deck:2,wb:.575,of:.19,wr:8.8,head:'split',tail:'bar',plast:1,cj:1,rack:1},
'BYD Song Plus':{L:111,yR:16.1,yB:31,yN:34.5,yD:28,yS:44.5,hood:28,ws:17,bk:8,deck:2,wb:.585,of:.19,wr:8.8,head:'slim',tail:'bar',cj:1,blk:1},
'GWM Haval H6':{L:109,yR:14.7,yB:30.5,yN:34,yD:27.5,yS:44,hood:27,ws:16,bk:7,deck:2,wb:.59,of:.19,wr:8.8,head:'slim',tail:'bar',plast:1,cj:1},
'Mazda CX-5':{L:106,yR:15.9,yB:31,yN:34.5,yD:28,yS:44.5,hood:28,ws:16,bk:8,deck:2,wb:.595,of:.19,wr:8.6,head:'slim',tail:'wrap',plast:1,cj:1,kick:2},
'Subaru Forester':{L:108,yR:14.7,yB:30.5,yN:34,yD:27,yS:44,hood:26,ws:15,bk:5,deck:2,wb:.575,of:.19,wr:8.8,head:'big',tail:'vert',plast:1,rack:1},
'Seat Arona':{L:96,yR:18.9,yB:31.5,yN:35.5,yD:29,yS:45,hood:24,ws:16,bk:8,deck:2,wb:.62,of:.18,wr:8,head:'slim',tail:'wrap',plast:1,blk:1},
'Skoda Kodiaq':{L:110,yR:15.9,yB:30.5,yN:34,yD:27.5,yS:44.5,hood:27,ws:15,bk:5,deck:2,wb:.595,of:.19,wr:8.8,head:'slim',tail:'wrap',plast:1,rack:1,cj:1},
'Opel Mokka':{L:97,yR:19.4,yB:31.5,yN:35.5,yD:29.5,yS:45,hood:25,ws:17,bk:10,deck:2,wb:.615,of:.18,wr:8.2,head:'slim',tail:'bar',plast:1,blk:1},
'Volkswagen Amarok':{L:122,yR:12.4,yB:29.5,yN:31.5,yD:29.5,yS:43,hood:30,ws:13,bk:2,deck:40,wb:.59,of:.16,wr:9.2,head:'big',tail:'vert',plast:1,flare:1,santo:1,doors:4},
'Chevrolet Montana':{L:110,yR:16.6,yB:31,yN:34.5,yD:31,yS:44.5,hood:26,ws:16,bk:2,deck:34,wb:.595,of:.17,wr:8.4,head:'split',tail:'vert',plast:1,doors:4},
'Chevrolet Silverado':{L:126,yR:10,yB:28,yN:30,yD:28,yS:42,hood:32,ws:13,bk:2,deck:44,wb:.64,of:.15,wr:9.6,head:'split',tail:'vert',cj:1,doors:4},
'Ford F-150':{L:126,yR:9.3,yB:28,yN:29.5,yD:28,yS:42,hood:33,ws:12,bk:2,deck:44,wb:.625,of:.15,wr:9.8,head:'big',tail:'vert',doors:4,cj:1},
'Ford Maverick':{L:118,yR:14.5,yB:30,yN:32.5,yD:30,yS:43.5,hood:28,ws:15,bk:2,deck:38,wb:.605,of:.17,wr:8.8,head:'big',tail:'vert',plast:1,doors:4},
'Toyota Tacoma':{L:124,yR:13.3,yB:29.5,yN:31.5,yD:29.5,yS:43,hood:31,ws:13,bk:2,deck:42,wb:.6,of:.16,wr:9.4,head:'slim',tail:'vert',plast:1,flare:1,doors:4},
'Toyota Tundra':{L:126,yR:8.9,yB:27.5,yN:29.5,yD:27.5,yS:42,hood:33,ws:12,bk:2,deck:44,wb:.63,of:.15,wr:10,head:'big',tail:'vert',cj:1,doors:4},
'Nissan Frontier':{L:122,yR:12.1,yB:29.5,yN:31.5,yD:29.5,yS:43,hood:30,ws:13,bk:2,deck:40,wb:.6,of:.16,wr:9.2,head:'slim',tail:'vert',plast:1,santo:1,doors:4},
'Mitsubishi L200 Triton':{L:122,yR:13,yB:29.5,yN:32,yD:29.5,yS:43,hood:30,ws:14,bk:2,deck:40,wb:.57,of:.17,wr:9.2,head:'split',tail:'vert',plast:1,flare:1,santo:1,doors:4},
'RAM 1500':{L:126,yR:9.1,yB:27.5,yN:29.5,yD:27.5,yS:42,hood:33,ws:13,bk:2,deck:43,wb:.64,of:.15,wr:9.8,head:'slim',tail:'vert',cj:1,doors:4},
'RAM 2500':{L:126,yR:8.4,yB:27,yN:29,yD:27,yS:41.5,hood:34,ws:12,bk:2,deck:44,wb:.64,of:.15,wr:10.4,head:'big',tail:'vert',cj:1,doors:4},
'RAM Rampage':{L:117,yR:16.1,yB:30.5,yN:33.5,yD:30.5,yS:44,hood:28,ws:16,bk:2,deck:37,wb:.6,of:.17,wr:8.8,head:'slim',tail:'vert',plast:1,doors:4},
'Renault Oroch':{L:110,yR:15.6,yB:31,yN:34,yD:31,yS:44.5,hood:26,ws:15,bk:2,deck:34,wb:.6,of:.17,wr:8.4,head:'big',tail:'vert',plast:1,santo:1,doors:4},
'Fiat Fiorino':{L:102,yR:10.7,yB:28.5,yN:32,yD:12,yS:45,hood:17,ws:13,bk:1,deck:1,wb:.62,of:.16,wr:7.8,head:'big',tail:'vert',rim:'calota',doors:2},
'Mercedes-Benz Sprinter':{L:118,yR:8,yB:25,yN:30,yD:9,yS:45,hood:14,ws:12,bk:1,deck:1,wb:.6,of:.15,wr:8.6,head:'big',tail:'vert',doors:2},
'Ford Transit':{L:116,yR:9,yB:25.5,yN:30,yD:10,yS:45,hood:15,ws:12,bk:1,deck:1,wb:.6,of:.15,wr:8.6,head:'slim',tail:'vert',doors:2},
'Fiat Ducato':{L:116,yR:9,yB:25,yN:29.5,yD:10,yS:45,hood:12,ws:12,bk:1,deck:1,wb:.62,of:.14,wr:8.4,head:'big',tail:'vert',doors:2},
'Porsche 911':{L:105,yR:24.7,yB:34.5,yN:39.5,yD:37.5,yS:47.5,hood:27,ws:17,bk:34,deck:3,wb:.54,of:.2,wr:8.4,round:1,tail:'bar',doors:2},
'Porsche 718 Cayman':{L:102,yR:25,yB:35,yN:40,yD:36,yS:47.5,hood:27,ws:22,bk:24,deck:17,wb:.565,of:.18,wr:8.4,head:'slim',tail:'bar',intake:1},
'Chevrolet Camaro':{L:111,yR:23.5,yB:33,yN:36.5,yD:32.5,yS:47.5,hood:38,ws:17,bk:17,deck:13,wb:.585,of:.17,wr:8.8,head:'slim',tail:'wrap',doors:2},
'Chevrolet Corvette':{L:108,yR:26.3,yB:36,yN:41.5,yD:35.5,yS:48,hood:30,ws:22,bk:28,deck:13,wb:.585,of:.19,wr:8.8,head:'slim',tail:'bar',intake:1},
'Ford Mustang':{L:112,yR:22.8,yB:33,yN:36.5,yD:33,yS:47.5,hood:38,ws:16,bk:20,deck:12,wb:.565,of:.18,wr:8.8,head:'slim',tail:'vert',doors:2},
'Dodge Challenger':{L:117,yR:21.2,yB:32.5,yN:35.5,yD:32,yS:47.5,hood:40,ws:15,bk:16,deck:16,wb:.59,of:.17,wr:8.8,round:1,tail:'bar',doors:2},
'Dodge Charger':{L:119,yR:20.5,yB:32.5,yN:36,yD:32,yS:47.5,hood:36,ws:17,bk:18,deck:12,wb:.6,of:.17,wr:8.8,head:'slim',tail:'bar',q3:5},
'Nissan GT-R':{L:110,yR:23.1,yB:34,yN:38,yD:33.5,yS:47.5,hood:33,ws:17,bk:22,deck:10,wb:.59,of:.18,wr:8.8,head:'swept',tail:'bar',spoiler:1,doors:2},
'Nissan 370Z':{L:99,yR:24.2,yB:34.5,yN:38.5,yD:34,yS:47.5,hood:32,ws:17,bk:22,deck:6,wb:.6,of:.17,wr:8.4,head:'swept',tail:'vert',doors:2},
'Toyota GR Supra':{L:102,yR:25,yB:35,yN:39.5,yD:34.5,yS:47.5,hood:35,ws:17,bk:20,deck:6,wb:.565,of:.18,wr:8.6,head:'slim',tail:'vert',doors:2},
'Toyota GR86':{L:99,yR:24.5,yB:34.5,yN:38.5,yD:34,yS:47.5,hood:31,ws:17,bk:17,deck:10,wb:.6,of:.17,wr:8.2,head:'swept',tail:'wrap',doors:2},
'Mazda MX-5':{L:91,yR:26.3,yB:35,yN:39.5,yD:34.5,yS:47.5,hood:34,ws:10,bk:6,deck:18,wb:.59,of:.15,wr:7.8,head:'slim',tail:'wrap',doors:2},
'Honda Civic Type R':{L:107,yR:22.1,yB:33,yN:38,yD:31.5,yS:47.5,hood:28,ws:20,bk:16,deck:3,wb:.595,of:.19,wr:8.6,head:'slim',tail:'bar',spoiler:1,q3:5},
'Subaru WRX STI':{L:107,yR:20.6,yB:33,yN:37,yD:32,yS:47.5,hood:28,ws:18,bk:15,deck:10,wb:.575,of:.2,wr:8.4,head:'swept',tail:'wrap',spoiler:1,scoop:1},
'BMW M3':{L:112,yR:21.7,yB:33,yN:37.5,yD:32,yS:47.5,hood:31,ws:19,bk:17,deck:9,wb:.595,of:.18,wr:8.8,head:'slim',tail:'wrap',kick:2,q3:5},
'BMW M4':{L:112,yR:22.6,yB:33.5,yN:37.5,yD:32.5,yS:47.5,hood:33,ws:19,bk:22,deck:8,wb:.595,of:.18,wr:8.8,head:'slim',tail:'wrap',kick:2,doors:2},
'BMW Z4':{L:101,yR:26,yB:35,yN:39.5,yD:34.5,yS:47.5,hood:40,ws:10,bk:6,deck:16,wb:.57,of:.17,wr:8.4,head:'slim',tail:'wrap',doors:2},
'Mercedes-AMG GT':{L:106,yR:25.6,yB:35,yN:39.5,yD:34.5,yS:47.5,hood:46,ws:15,bk:24,deck:3,wb:.58,of:.18,wr:8.8,head:'slim',tail:'bar',doors:2},
'Audi R8':{L:103,yR:26.1,yB:36,yN:41,yD:35,yS:48,hood:28,ws:22,bk:26,deck:14,wb:.6,of:.18,wr:8.6,head:'slim',tail:'bar',intake:1},
'Audi TT RS':{L:98,yR:23.8,yB:34,yN:38.5,yD:33.5,yS:47.5,hood:29,ws:17,bk:24,deck:4,wb:.6,of:.17,wr:8.4,head:'slim',tail:'wrap',round:0,spoiler:1,doors:2},
'Ferrari 488 GTB':{L:106,yR:26.8,yB:36,yN:41.5,yD:35.5,yS:48,hood:30,ws:22,bk:27,deck:13,wb:.58,of:.19,wr:8.8,head:'swept',tail:'bar',intake:1},
'Ferrari F8 Tributo':{L:107,yR:26.8,yB:36,yN:41.5,yD:35.5,yS:48,hood:30,ws:22,bk:27,deck:14,wb:.575,of:.19,wr:8.8,head:'swept',tail:'bar',intake:1,spoiler:1},
'Ferrari 296 GTB':{L:106,yR:27.3,yB:36.5,yN:41.5,yD:36,yS:48,hood:30,ws:23,bk:26,deck:13,wb:.57,of:.2,wr:8.8,head:'swept',tail:'bar',intake:1},
'Ferrari Roma':{L:109,yR:24.7,yB:34.5,yN:39,yD:34,yS:47.5,hood:42,ws:17,bk:24,deck:6,wb:.57,of:.19,wr:8.8,head:'slim',tail:'wrap',doors:2},
'Lamborghini Huracán':{L:105,yR:27.9,yB:36.5,yN:42,yD:35.5,yS:48,hood:29,ws:24,bk:26,deck:13,wb:.585,of:.19,wr:8.8,head:'swept',tail:'bar',intake:1},
'Lamborghini Aventador':{L:112,yR:28.5,yB:36.5,yN:42,yD:35.5,yS:48,hood:30,ws:26,bk:28,deck:14,wb:.565,of:.2,wr:9,head:'swept',tail:'bar',intake:1,spoiler:1},
'McLaren 720S':{L:106,yR:27.1,yB:36,yN:41.5,yD:35.5,yS:48,hood:27,ws:24,bk:28,deck:13,wb:.59,of:.19,wr:8.8,head:'swept',tail:'bar',intake:1},
'Alpine A110':{L:97,yR:25.9,yB:35,yN:39.5,yD:34.5,yS:47.5,hood:28,ws:18,bk:24,deck:10,wb:.585,of:.18,wr:8.2,round:1,tail:'wrap',doors:2},
'Aston Martin Vantage':{L:104,yR:25.4,yB:35,yN:39.5,yD:34.5,yS:47.5,hood:40,ws:15,bk:24,deck:6,wb:.605,of:.16,wr:8.8,head:'swept',tail:'bar',doors:2},
'Bugatti Chiron':{L:106,yR:26.8,yB:36,yN:41,yD:35,yS:48,hood:30,ws:22,bk:28,deck:12,wb:.6,of:.17,wr:9,head:'slim',tail:'bar',intake:1},
'Mercedes-Benz Classe C':{L:111,yR:21.4,yB:33,yN:37,yD:32,yS:47.5,hood:31,ws:19,bk:17,deck:10,wb:.6,of:.18,wr:8.4,head:'slim',tail:'wrap',cj:1,q3:4},
'Mercedes-Benz Classe E':{L:115,yR:20.8,yB:32.5,yN:37,yD:32,yS:47.5,hood:32,ws:19,bk:17,deck:11,wb:.6,of:.18,wr:8.6,head:'slim',tail:'wrap',cj:1,q3:5},
'Mercedes-Benz Classe S':{L:121,yR:20,yB:32.5,yN:36.5,yD:31.5,yS:47.5,hood:33,ws:19,bk:18,deck:12,wb:.6,of:.17,wr:8.8,head:'slim',tail:'wrap',cj:1,q3:6},
'Mercedes-Benz Classe G':{L:113,yR:9.1,yB:29,yN:30.5,yD:13,yS:43,hood:23,ws:4,bk:1,deck:1,wb:.6,of:.15,wr:9.8,round:1,tail:'vert',spare:1,cj:1,doors:4},
'BMW Série 3':{L:110,yR:21.4,yB:33,yN:37,yD:32,yS:47.5,hood:30,ws:19,bk:17,deck:10,wb:.605,of:.17,wr:8.4,head:'slim',tail:'wrap',kick:2,q3:5,cj:1},
'BMW Série 5':{L:115,yR:20.5,yB:32.5,yN:37,yD:32,yS:47.5,hood:31,ws:19,bk:17,deck:11,wb:.6,of:.17,wr:8.6,head:'slim',tail:'wrap',kick:2,q3:5,cj:1},
'BMW Série 7':{L:124,yR:19.1,yB:32,yN:35.5,yD:31,yS:47,hood:35,ws:19,bk:17,deck:12,wb:.6,of:.17,wr:9,head:'split',tail:'bar',kick:2,q3:6,cj:1},
'BMW X5':{L:115,yR:14.3,yB:30.5,yN:33.5,yD:27,yS:44,hood:29,ws:16,bk:7,deck:2,wb:.605,of:.17,wr:9.2,head:'slim',tail:'wrap',kick:2,cj:1,rack:1}
};
let V4_UID=0;
function v4Perfil(P){ const f=P.xF, t=P.xT, ws0=f-P.hood, ws1=ws0-P.ws, re=ws1-P.roof, bk1=re-P.bk;
  const ar=P.wr+1.6, wf=P.wfX, wb=P.wbX;
  return `M${f-3} ${P.yS}Q${f+1} ${P.yS} ${f+1} ${P.yS-4}L${f+1} ${P.yN+3}Q${f+1} ${P.yN} ${f-3} ${P.yN-.6}`+
    `Q${(f+ws0)/2} ${P.yB-1.8} ${ws0} ${P.yB-.6}L${ws1+2.4} ${P.yR+1}Q${ws1} ${P.yR} ${ws1-3} ${P.yR}`+
    `Q${(ws1+re)/2} ${P.yR-1.6} ${re+2} ${P.yR}Q${re} ${P.yR+.3} ${re-.6} ${P.yR+1.6}L${bk1+.6} ${P.yD-.8}Q${bk1} ${P.yD} ${bk1-1.4} ${P.yD}`+
    `L${t+2.4} ${P.yD+.4}Q${t} ${P.yD+.8} ${t} ${P.yD+3.4}L${t} ${P.yS-3}Q${t} ${P.yS} ${t+3} ${P.yS}`+
    `L${wb-ar} ${P.yS}A${ar} ${ar} 0 0 1 ${wb+ar} ${P.yS}L${wf-ar} ${P.yS}A${ar} ${ar} 0 0 1 ${wf+ar} ${P.yS}Z`; }
function v4Vidro(P){ const ws0=P.xF-P.hood, ws1=ws0-P.ws, re=ws1-P.roof, bk1=re-P.bk, yb=P.yB-1.2, yt=P.yR+1.9;
  const xa=ws0-1.6-(P.ws)*(1-(yb-P.yR)/(P.yB-P.yR)), xA=ws0-2.2;
  const yq=Math.min(yb,P.yD-1); let xd=re-.8-(P.bk)*Math.min(1,(yq-P.yR)/Math.max(1,P.yD-P.yR));
  const cp=P.cp||0, x2=re+.6+cp; xd+=cp*1.3; const xk=xd+(xA-xd)*.28;
  return {d:P.kick?`M${xA} ${yb}L${ws1+1.2} ${yt}H${x2}L${xd} ${Math.min(yq,yb)-P.kick}L${xk} ${yb}Z`:`M${xA} ${yb}L${ws1+1.2} ${yt}H${x2}L${xd} ${yq}${yq<yb?`V${yb}`:''}Z`,xA,x1:ws1+1.2,x2,xd,yb,yt}; }
function car4SVG(r,cor,w=56){ r=typeof r==='string'?VEIC4[r]:r; if(!r) return '';
  const F=VEIC4_FORMA[r.forma]||VEIC4_FORMA.hatch, MD=(!r.classico&&V4_MOD[r.marca+' '+r.modelo])||null, P=Object.assign({},F,r.o||{},MD||{}), uid='v4'+(++V4_UID); if(MD&&MD.roof==null) P.roof=null;
  const c=VEIC4_COR[cor]||(/^#/.test(cor||'')?cor:VEIC4_COR[Object.keys(VEIC4_COR)[hashS(r.id)%8]]);
  if(P.box&&r.forma!=='box'){ P.ws=Math.min(P.ws,10); if(/hatch/.test(r.forma)){ P.bk=2; P.yD=P.yR+7; P.deck=1; } }
  if(P.roof==null) P.roof=Math.max(8,P.L-P.hood-P.ws-P.bk-P.deck); P.xF=64+P.L/2; P.xT=64-P.L/2; const yG=55, wc=yG-P.wr;
  P.wfX=P.xF-Math.max(P.wr+5,P.L*.17); P.wbX=P.xT+Math.max(P.wr+5,P.L*(P.bed||P.van?.2:.18));
  if(r.forma==='super'||r.forma==='p911'){ P.wfX=P.xF-P.L*.16; P.wbX=P.xT+P.L*.19; }
  if(P.wb){ P.wfX=P.xF-P.L*P.of; P.wbX=P.wfX-P.L*P.wb; } if(P.blk&&!P.top) P.top='#1F2329';
  const esc=bxD(c,.45), cl=bxL(c,.35), vid='#26323F', cromo=P.chrome||r.classico;
  let corpo='', det='';
  if(r.forma==='fusca'){ const f=P.xF,t=P.xT; corpo=`M${f-2} ${P.yS}Q${f+2} ${P.yS} ${f+1} ${P.yS-6}Q${f} ${P.yS-14} ${f-14} ${P.yS-17}Q${f-24} ${P.yR-1} ${64} ${P.yR}Q${t+18} ${P.yR} ${t+6} ${P.yS-16}Q${t-1} ${P.yS-8} ${t+1} ${P.yS}`+
      `L${P.wbX-P.wr-1.8} ${P.yS}A${P.wr+1.8} ${P.wr+1.8} 0 0 1 ${P.wbX+P.wr+1.8} ${P.yS}L${P.wfX-P.wr-1.8} ${P.yS}A${P.wr+1.8} ${P.wr+1.8} 0 0 1 ${P.wfX+P.wr+1.8} ${P.yS}Z`;
    det+=`<path d="M${f-16} ${P.yR+9}Q${f-22} ${P.yR+2} ${64} ${P.yR+2.6}Q${t+20} ${P.yR+3} ${t+14} ${P.yR+10}Z" fill="${vid}"/><path d="M64 ${P.yR+2.6}V${P.yR+10}" stroke="${c}" stroke-width="2"/>`;
    det+=`<circle cx="${f-4}" cy="${P.yS-10.5}" r="2.2" fill="#FFF4C8" stroke="${esc}" stroke-width=".6"/>`; }
  else if(r.forma==='kombi'){ const f=P.xF,t=P.xT; corpo=`M${f-2} ${P.yS}Q${f+2} ${P.yS} ${f+2} ${P.yS-5}L${f+1} ${P.yR+8}Q${f} ${P.yR} ${f-8} ${P.yR}H${t+6}Q${t} ${P.yR} ${t} ${P.yR+6}V${P.yS-3}Q${t} ${P.yS} ${t+3} ${P.yS}`+
      `L${P.wbX-P.wr-1.6} ${P.yS}A${P.wr+1.6} ${P.wr+1.6} 0 0 1 ${P.wbX+P.wr+1.6} ${P.yS}L${P.wfX-P.wr-1.6} ${P.yS}A${P.wr+1.6} ${P.wr+1.6} 0 0 1 ${P.wfX+P.wr+1.6} ${P.yS}Z`;
    det+=`<path d="M${f+1.4} ${P.yR+13}L${f-1} ${P.yS-13}H${t}V${P.yR+13}Z" fill="${P.top||'#EEF0F3'}" stroke="none"/>`;
    for(let i=0;i<4;i++){ const x0=t+4+i*((P.L-10)/4); det+=`<rect x="${x0}" y="${P.yR+3}" width="${(P.L-10)/4-2.4}" height="8" rx="1.6" fill="${vid}"/>`; }
    det+=`<path d="M${f-10} ${P.yS-14}V${P.yS-2}M${f-34} ${P.yS-14}V${P.yS-2}" stroke="${esc}" stroke-width=".8" opacity=".6"/><circle cx="${f-.5}" cy="${P.yS-11}" r="2" fill="#FFF4C8" stroke="${esc}" stroke-width=".6"/>`; }
  else if(r.forma==='cyber'){ const f=P.xF,t=P.xT; corpo=`M${f} ${P.yS}L${f+1} ${P.yS-9}L${64-4} ${P.yR}L${t} ${P.yS-14}V${P.yS}`+
      `L${P.wbX-P.wr-1.4} ${P.yS}L${P.wbX-P.wr+1} ${P.yS-P.wr-1}H${P.wbX+P.wr-1}L${P.wbX+P.wr+1.4} ${P.yS}L${P.wfX-P.wr-1.4} ${P.yS}L${P.wfX-P.wr+1} ${P.yS-P.wr-1}H${P.wfX+P.wr-1}L${P.wfX+P.wr+1.4} ${P.yS}Z`;
    det+=`<path d="M${f-14} ${P.yS-12.5}L${64-4} ${P.yR+3}L${64-24} ${P.yR+8.5}V${P.yS-12.5}Z" fill="${vid}"/><path d="M${64-14} ${P.yR+6}V${P.yS-12}" stroke="${c}" stroke-width="1.6"/><path d="M${f-1} ${P.yS-9.4}H${f-14}" stroke="#E9F4FF" stroke-width="1"/>`; }
  else corpo=v4Perfil(P);
  const conv=r.forma==='fusca'||r.forma==='kombi'||r.forma==='cyber';
  if(!conv){ const g=v4Vidro(P), ws0=P.xF-P.hood, re=ws0-P.ws-P.roof, bk1=re-P.bk;
    if(P.open){ det+=`<path d="M${g.xA} ${g.yb}L${g.x1+1} ${P.yR+1}" stroke="#2A2F36" stroke-width="1.4"/><path d="M${g.x1-1} ${P.yB-.8}Q${(g.x1+re)/2} ${P.yB-4.5} ${re-2} ${P.yB-.8}" fill="#2A2F36"/>`; }
    else { det+=`<path d="${g.d}" fill="url(#${uid}_v)" stroke="#1A2129" stroke-width=".7" stroke-linejoin="round"/>`;
      const bx=P.doors===4?(g.x1+g.x2)/2+2:g.x2+((g.xd-g.x2)>6?6:2);
      const pc=P.blk?'#1F2329':c; if(P.blk) det+=`<path d="M${g.x2+.4} ${g.yt-.4}L${g.xd+.2} ${g.yb-(P.kick||0)}L${g.xd-4} ${g.yb}L${g.x2-3.5} ${g.yt-.4}Z" fill="#1F2329"/>`;
      if(P.q3) det+=`<path d="M${g.x2+P.q3} ${g.yt}L${g.x2+P.q3+1.2} ${g.yb}" stroke="${pc}" stroke-width="1.8"/>`;
      if(P.cj) det+=`<path d="M${g.xA} ${g.yb+.7}L${g.xd+2} ${g.yb+.7}" stroke="#E3E7EC" stroke-width=".8"/>`;
      if(P.doors>=2&&!P.van){ det+=`<path d="M${bx} ${g.yt}V${g.yb}" stroke="${pc}" stroke-width="${P.doors===4?2:1.6}"/>`; if(P.doors===2&&g.xd<g.x2-8) det+=`<path d="M${g.x2-6} ${g.yt}L${g.x2-8} ${g.yb}" stroke="${c}" stroke-width="1.6"/>`; }
      if(P.van) det+=`<path d="M${g.x1-12} ${g.yt}V${g.yb}M${g.x1-36} ${g.yt}V${g.yb}" stroke="${c}" stroke-width="2"/>`;
      det+=`<path d="M${g.x1+3} ${g.yt+1}L${g.x1+7} ${g.yt+1}L${g.xA-6} ${g.yb-1}H${g.xA-9}Z" fill="#fff" opacity=".18" stroke="none"/>`; }
    if(P.top&&!P.open) det+=`<path d="M${ws0-P.ws-2} ${P.yR+.2}Q${(ws0-P.ws+re)/2} ${P.yR-1} ${re+1.4} ${P.yR+.2}L${re+1} ${P.yR+1.5}H${ws0-P.ws-1}Z" fill="${P.top}" stroke="none"/>`;
    // portas, maçanetas e frisos
    const d0=ws0-1, dm=P.doors===4?(g.x1+g.x2)/2+2:null, d2=P.bed?re-P.bk-1:Math.max(P.wbX+P.wr+3,(P.doors===4?dm-(d0-dm)*.95:d0-P.ws-P.roof*.75));
    if(!P.van&&P.doors){ det+=`<path d="M${d0} ${P.yB-.4}V${P.yS-1.4}${dm?`M${dm} ${P.yB}V${P.yS-1}`:''}M${d2} ${P.yB}Q${d2+1} ${(P.yB+P.yS)/2} ${d2} ${P.yS-1}" stroke="${esc}" stroke-width=".7" fill="none" opacity=".75"/>`;
      det+=`<rect x="${(dm||d2)+2}" y="${P.yB+2.2}" width="4" height="1.3" rx=".6" fill="${cl}" stroke="${esc}" stroke-width=".4"/>`; if(dm) det+=`<rect x="${d2+2}" y="${P.yB+2.2}" width="4" height="1.3" rx=".6" fill="${cl}" stroke="${esc}" stroke-width=".4"/>`; }
    det+=(P.lin?`<path d="M${P.xT+3} ${P.yB+P.lin[1]}L${P.xF-5} ${P.yB+P.lin[0]}"`:`<path d="M${P.xT+3} ${P.yB+4}Q64 ${P.yB+2.6} ${P.xF-4} ${P.yB+3.6}"`)+` stroke="${cl}" stroke-width=".8" fill="none" opacity=".8"/>`;
    det+=`<path d="M${d0-1.4} ${P.yB-1.2}l3 -2.6h2.2v2.6z" fill="${c}" stroke="${esc}" stroke-width=".5"/>`;
    // faróis e lanternas
    if(P.lin2) det+=`<path d="M${P.wbX+P.wr+3} ${P.yS-4.6}Q64 ${P.yS-6.4} ${P.wfX-P.wr-3} ${P.yS-5.6}" stroke="${esc}" stroke-width=".6" fill="none" opacity=".55"/>`;
    const fx=P.xF, fy=P.yN, hs='fill="#FFF4C8" stroke="'+esc+'" stroke-width=".5"';
    det+=P.round?`<circle cx="${fx-3}" cy="${fy+1.6}" r="2" ${hs}/>`:P.head==='slim'?`<path d="M${fx+.6} ${fy+.3}L${fx-11} ${fy-.9}Q${fx-10} ${fy+.9} ${fx-1} ${fy+1.5}Z" ${hs}/>`:
      P.head==='big'?`<path d="M${fx+.8} ${fy-.3}L${fx-6.5} ${fy-.9}L${fx-6} ${fy+3}L${fx+.8} ${fy+3.2}Z" ${hs}/>`:P.head==='swept'?`<path d="M${fx+.6} ${fy+1}L${fx-13} ${fy-1.7}Q${fx-10} ${fy+1} ${fx-2} ${fy+2.8}Z" ${hs}/>`:
      P.head==='split'?`<path d="M${fx+.6} ${fy-.2}L${fx-10} ${fy-1.2}L${fx-9.6} ${fy-.3}L${fx} ${fy+.6}Z" fill="#F4FBFF" stroke="${esc}" stroke-width=".4"/><path d="M${fx+1} ${fy+3.2}h-5v2.4h5z" ${hs}/>`:`<path d="M${fx+.6} ${fy+.6}L${fx-7} ${fy-.1}Q${fx-6} ${fy+2} ${fx-1} ${fy+2.4}Z" ${hs}/>`;
    const tx=P.xT, ty=P.yD, ts='fill="#D33A2C" stroke="#7A1C16" stroke-width=".4"';
    det+=P.tail==='vert'?`<path d="M${tx-.3} ${ty+.8}h3.4l-.4 ${P.bed?8:7}h-3z" ${ts}/>`:P.tail==='wrap'?`<path d="M${tx-.3} ${ty+1.4}h8.5l-1.4 2.6h-7.1z" ${ts}/>`:
      P.tail==='bar'?`<path d="M${tx-.3} ${ty+1.6}h6.5v1.4h-6.5z" ${ts}/><path d="M${tx-.3} ${ty+1.6}v4h2.2v-4" ${ts}/>`:P.tail==='x'?`<rect x="${tx-.3}" y="${ty+1.5}" width="4" height="6" rx=".6" ${ts}/><path d="M${tx+.2} ${ty+2}l3 5M${tx+3.2} ${ty+2}l-3 5" stroke="#3A0F0B" stroke-width=".6"/>`:
      `<path d="M${tx-.3} ${ty+2}h3.2v${P.bed||P.forma==='box'?5:2.6}h-3.2z" ${ts}/>`;
    if(P.rsp) det+=`<path d="M${re+1.6} ${P.yR-.2}L${re-5} ${P.yR+1.6}L${re-4.6} ${P.yR+2.6}L${re+1} ${P.yR+1.4}Z" fill="${c}" stroke="${esc}" stroke-width=".5"/>`;
    if(P.santo) det+=`<path d="M${bk1-2} ${P.yD}V${P.yR+5.5}Q${bk1-2} ${P.yR+4} ${bk1-4} ${P.yR+4}H${bk1-12}" stroke="#2A2D33" stroke-width="1.4" fill="none"/>`;
    if(P.bed) det+=`<path d="M${bk1-.6} ${P.yD+.4}V${P.yS-2}M${bk1-1} ${P.yD+1.6}H${P.xT+1.5}" stroke="${esc}" stroke-width=".8" fill="none"/>`;
    if(P.spoiler) det+=`<path d="M${P.xT+1} ${P.yD-.4}l-1 -3.4h11l1 3.4" fill="#1F2329" stroke="#111" stroke-width=".5"/>`;
    if(P.scoop) det+=`<path d="M${ws0+6} ${P.yB-1.4}h7l1.6 -1.6h-6z" fill="#1F2329"/>`;
    if(P.rack) det+=`<path d="M${ws0-P.ws-1} ${P.yR-1.2}H${re+1}" stroke="#2A2F36" stroke-width="1.2"/><path d="M${ws0-P.ws+2} ${P.yR-1.2}v1.2M${re-1} ${P.yR-1.2}v1.2" stroke="#2A2F36" stroke-width="1"/>`;
    if(P.stripe) det+=`<path d="M${P.xT+2} ${P.yB+5.6}H${P.xF-3}" stroke="#F2F3F5" stroke-width="1.6" opacity=".9"/>`;
    if(P.intake) det+=`<path d="M${P.wbX+P.wr+3} ${P.yB+2}q6 1 9 7h-8z" fill="#1F2329" opacity=".85"/>`;
  }
  const plast=P.plast||!r.classico&&r.cat!=='Luxo e executivos'&&['suv','suvP','box','pick','evsuv'].includes(r.forma)||/Outsider|Trekking|Stepway|Way|Cross|Track|Storm|Freestyle/.test(r.versao);
  if(plast){ for(const x of [P.wbX,P.wfX]) det+=`<path d="M${x-P.wr-3} ${P.yS+.4}A${P.wr+3} ${P.wr+3.2} 0 0 1 ${x+P.wr+3} ${P.yS+.4}" fill="none" stroke="#2A2D33" stroke-width="${r.forma==='box'||P.flare?3.2:2.4}"/>`; det+=`<path d="M${P.wbX+P.wr+3} ${P.yS-1.2}H${P.wfX-P.wr-3}" stroke="#2A2D33" stroke-width="2.6"/>`; }
  if(r.forma==='fusca'){ for(const x of [P.wbX,P.wfX]) det+=`<path d="M${x-P.wr-4} ${P.yS}Q${x-P.wr-3} ${P.yS-P.wr*1.9} ${x} ${P.yS-P.wr*2}Q${x+P.wr+3} ${P.yS-P.wr*1.9} ${x+P.wr+4} ${P.yS}Z" fill="url(#${uid}_c)" stroke="${esc}" stroke-width=".8"/>`; det+=`<path d="M${P.wbX+P.wr+4} ${P.yS-1}H${P.wfX-P.wr-4}" stroke="#2A2D33" stroke-width="2"/>`; }
  if(r.modelo==='Defender') det+=`<path d="M${P.xF-P.hood-P.ws-6} ${P.yR+.6}h4M${P.xF-P.hood-P.ws-14} ${P.yR+.6}h4" stroke="#5E7389" stroke-width="1.2"/>`;
  if(/^(Tesla|Lucid|Porsche|Kia|Hyundai)$/.test(r.marca)&&r.cat==='Elétricos') det+=`<path d="M${P.xT} ${P.yD+2.2}h5" stroke="#D33A2C" stroke-width="1.2"/>`;
  const saia=`<path d="M${P.xT+2} ${P.yS-1.2}H${P.xF-2}" stroke="${cromo?'#D9DEE4':bxD(c,.6)}" stroke-width="${cromo?1.4:1.8}" opacity=".9"/>`;
  const aro=r.cat==='Esportivos'||r.cat==='Luxo e executivos'||r.cat==='Elétricos'?5:cromo?0:(P.bed||r.forma==='box'?6:5);
  const caixa=x=>`<path d="M${x-P.wr-1.6} ${P.yS}A${P.wr+1.6} ${P.wr+1.6} 0 0 1 ${x+P.wr+1.6} ${P.yS}Z" fill="#121417"/>`;
  const roda=x=>{ let s=`<circle cx="${x}" cy="${wc}" r="${P.wr}" fill="#1B1E23"/><circle cx="${x}" cy="${wc}" r="${P.wr*.66}" fill="url(#${uid}_a)" stroke="#5B616A" stroke-width=".5"/>`;
    if(P.rim==='calota'&&!cromo){ s+=`<circle cx="${x}" cy="${wc}" r="${P.wr*.7}" fill="#C9CED5" stroke="#8A919B" stroke-width=".5"/><circle cx="${x}" cy="${wc}" r="${P.wr*.5}" fill="none" stroke="#9AA1AB" stroke-width=".5"/>`;
      for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; s+=`<circle cx="${x+Math.cos(a)*P.wr*.6}" cy="${wc+Math.sin(a)*P.wr*.6}" r="${P.wr*.07}" fill="#4A4F57"/>`; } s+=`<circle cx="${x}" cy="${wc}" r="${P.wr*.16}" fill="#E8EBEF" stroke="#8A919B" stroke-width=".4"/>`; }
    else if(cromo) s+=`<circle cx="${x}" cy="${wc}" r="${P.wr*.8}" fill="none" stroke="#EDEFF2" stroke-width="1.1"/><circle cx="${x}" cy="${wc}" r="${P.wr*.34}" fill="#EDEFF2" stroke="#9AA1AB" stroke-width=".5"/>`;
    else { for(let i=0;i<aro;i++){ const a=i/aro*Math.PI*2+.3; s+=`<path d="M${x+Math.cos(a)*P.wr*.18} ${wc+Math.sin(a)*P.wr*.18}L${x+Math.cos(a)*P.wr*.62} ${wc+Math.sin(a)*P.wr*.62}" stroke="#7E858F" stroke-width="${P.wr*.17}" stroke-linecap="round"/>`; }
      if(r.cat==='Esportivos') s+=`<path d="M${x-P.wr*.5} ${wc-P.wr*.3}a${P.wr*.58} ${P.wr*.58} 0 0 1 ${P.wr*.4} -${P.wr*.28}" stroke="#D33A2C" stroke-width="1.6" fill="none"/>`;
      s+=`<circle cx="${x}" cy="${wc}" r="${P.wr*.17}" fill="#C9CED5" stroke="#6B717B" stroke-width=".4"/>`; }
    return s+`<path d="M${x-P.wr*.7} ${wc-P.wr*.55}a${P.wr*.9} ${P.wr*.9} 0 0 1 ${P.wr*.9} -${P.wr*.35}" stroke="#fff" stroke-width=".7" opacity=".22" fill="none"/>`; };
  const pneuStep=P.spare?`<circle cx="${P.xT-2.6}" cy="${(P.yR+P.yS)/2+2}" r="${P.wr*.72}" fill="#1B1E23"/><circle cx="${P.xT-2.6}" cy="${(P.yR+P.yS)/2+2}" r="${P.wr*.38}" fill="${c}"/>`:'';
  const defs=`<defs><linearGradient id="${uid}_c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bxL(c,.38)}"/><stop offset=".42" stop-color="${c}"/><stop offset=".7" stop-color="${bxD(c,.12)}"/><stop offset="1" stop-color="${bxD(c,.38)}"/></linearGradient>`+
    `<linearGradient id="${uid}_v" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#5E7389"/><stop offset=".5" stop-color="${vid}"/><stop offset="1" stop-color="#151C24"/></linearGradient>`+
    `<radialGradient id="${uid}_a" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#F1F3F6"/><stop offset=".6" stop-color="#AEB4BD"/><stop offset="1" stop-color="#6E747D"/></radialGradient>`+
    `<radialGradient id="${uid}_s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>`+
    `<linearGradient id="${uid}_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`;
  const brilho=`<path d="M${P.xT+5} ${(r.forma==='fusca'||r.forma==='kombi'?P.yR+12:P.yB+.6)}Q64 ${(r.forma==='fusca'||r.forma==='kombi'?P.yR+10:P.yB-1)} ${P.xF-6} ${(r.forma==='fusca'||r.forma==='kombi'?P.yR+12:P.yB+.4)}" stroke="url(#${uid}_b)" stroke-width="1.6" fill="none" opacity=".7"/>`;
  const h=Math.round(w*.5);
  return `<svg class="car4" viewBox="0 6 128 56" width="${w}" height="${Math.round(w*56/128)}" aria-hidden="true">${defs}<ellipse cx="64" cy="${yG+.6}" rx="${P.L*.56}" ry="3.6" fill="url(#${uid}_s)"/>${pneuStep}${caixa(P.wbX)}${caixa(P.wfX)}`+
    `<path d="${corpo}" fill="url(#${uid}_c)" stroke="${esc}" stroke-width=".9" stroke-linejoin="round"/>${det}${saia}${brilho}${roda(P.wbX)}${roda(P.wfX)}</svg>`; }

// ---------- mercado: preço e disponibilidade conforme o país ----------
const v4Relogio=()=>Math.min(S.year,2025);
function v4Local(r,pais){ return r.mk[0]===pais||r.origem===pais; }
function v4Vende(r,pais){ return r.mk.includes('*')||r.mk.includes(pais); }
function v4Manut(r,pais){ if(v4Local(r,pais)) return 1; return VEIC4_EUROPA.includes(r.origem)&&VEIC4_EUROPA.includes(pais)?1.15:v4Vende(r,pais)?1.3:1.7; }
function v4Preco(r,pais,idade){ pais=pais||S.me.country; let k=1; try{ k=Math.max(.5,Math.min(2.2,mercadoIndice(pais,'veiculos'))); }catch(e){}
  const imp=v4Local(r,pais)?1:v4Vende(r,pais)?(pais==='BR'||pais==='AR'||pais==='IN'?1.35:1.12):1.7;
  const dep=r.classico?1:idade<=0?1:Math.max(.16,.82*Math.pow(.9,idade-1));
  return Math.max(1000,Math.round(r.preco*k*imp*dep/100)*100); }
// cores como nas ruas: branco, prata, preto e cinza são a maioria; esportivo e compacto puxam mais cor
const V4_PESO={branco:24,prata:18,preto:18,cinza:12,'cinza-grafite':8,vermelho:6,azul:5,'azul-marinho':3,verde:1,'verde-musgo':1,amarelo:1,vinho:1,laranja:1,bege:1,marrom:1};
function v4Rng(seed){ let a=seed>>>0||1; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
function v4Cor(r,f){ const p=Object.assign({},V4_PESO); if(r.cat==='Esportivos'){ p.vermelho=22; p.amarelo=8; p.laranja=6; p.azul=10; } if(/hatchP|mini/.test(r.forma)){ p.vermelho+=6; p.azul+=4; p.verde+=3; } if(r.classico){ p.bege=8; p.vinho=6; p.verde=6; p.marrom=6; }
  const tot=Object.values(p).reduce((a,b)=>a+b,0); let x=f()*tot; for(const [k,w] of Object.entries(p)){ if((x-=w)<0) return k; } return 'branco'; }
function v4Oferta(r,usado){ const m=S.me, f=v4Rng(hashS(r.id+'|'+S.year+'|'+(m.id||m.first||''))), pais=m.country, rel=v4Relogio(), idade=r.classico?rel-r.ano:Math.max(0,rel-r.ano);
  const v=Math.round(v4Preco(r,pais,idade)*(r.classico?(.8+f()*.5):(.94+f()*.12))/100)*100;
  return {v4:r.id,model:r.id,n:v4Nome(r)+(idade===0&&!r.classico?' 0 km':''),t:r.cat,cat:r.cat,cor:v4Cor(r,f),v,cond:r.classico?55+Math.floor(f()*41):idade===0?100:Math.max(35,100-idade*4-Math.floor(f()*13)),classic:r.classico,ic:null,imp:!v4Vende(r,pais),manut:v4Manut(r,pais)}; }
function v4Disponiveis(pais){ const rel=v4Relogio(); return VEICULOS4.filter(r=>r.ano<=rel&&(r.classico||rel-r.ano<=15)&&v4Vende(r,pais)); }
function v4Estoque(){ const m=S.me; if(!m.yr.cars4){ const pais=m.country, d=v4Disponiveis(pais), fora=VEICULOS4.filter(r=>r.ano<=v4Relogio()&&!v4Vende(r,pais)&&!r.classico);
    m.yr.cars4=R.shuffle(d).slice(0,14).concat(R.chance(.5)&&fora.length?[R.pick(fora)]:[]).map(r=>v4Oferta(r)).sort((a,b)=>a.v-b.v); } return m.yr.cars4; }
function v4Comprar(o,fin){ const m=S.me; if(m.age<18) return 'Preciso ter 18 anos para comprar um carro.';
  if(fin){ const ent=Math.round(o.v*.2); if(!canPay(ent)) return `Preciso de ${fmt(ent)} de entrada.`; if(!m.job&&!m.office&&!m.ret) return 'O banco não financia carro para quem não tem renda.'; m.money-=ent; const bal=Math.round((o.v-ent)*1.3); m.loans.push({n:`Financiamento · ${o.n}`,bal,pay:Math.max(1500,Math.round(bal/5))}); }
  else { if(!canPay(o.v)) return 'Não tenho dinheiro suficiente.'; m.money-=o.v; }
  m.assets.push({id:newId(),k:'carro',n:o.n,value:o.v,cond:o.cond,buy:o.v,classic:o.classic,cor:o.cor,model:o.v4,v4:o.v4,manut:o.manut}); st('happy',8);
  if(m.yr.cars4) m.yr.cars4=m.yr.cars4.filter(x=>x!==o);
  return `Comprei um ${o.n} ${o.cor}${fin?' financiado em 5 anos':''}.${o.imp?' Veio importado: as peças vão sair caras.':''}`; }
function v4Pinta(k){ const o=window.V4_OF; if(!o) return; o.cor=k; const el=document.getElementById('v4Fig'); if(el) el.innerHTML=car4SVG(o.v4,k,220); document.querySelectorAll('.v4cores button').forEach(b=>b.style.borderColor=b.title===k?'#2A2238':'rgba(0,0,0,.15)'); const n=document.getElementById('v4CorNome'); if(n) n.textContent='Cor: '+k; }
function v4Ficha(o){ const r=VEIC4[o.v4], m=S.me, pais=m.country;
  const x=[`${r.marca} · ${r.modelo} · ${r.versao} · ${r.ano}`,`Categoria: ${r.cat}`,...(o.cond===100&&!o.classic?[]:[`Cor: ${o.cor}`]),`Conservação: ${o.cond}%`,`Preço: ${fmt(o.v)}`,
    v4Local(r,pais)?'Fabricado aqui: peças baratas.':o.imp?'Não é vendido oficialmente aqui: importação independente.':'Importado: manutenção mais cara.',r.forma==='ev'||r.forma==='evsuv'||r.cat==='Elétricos'?'Elétrico: quase não gasta com combustível.':''].filter(Boolean).join('\n');
  window.V4_OF=o; const zero=o.cond===100&&!o.classic;
  const cores=zero?`<div class="v4cores" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin:2px 0 4px">${Object.entries(VEIC4_COR).map(([k,h])=>`<button title="${k}" onclick="v4Pinta('${k}')" style="width:22px;height:22px;border-radius:50%;border:2px solid ${k===o.cor?'#2A2238':'rgba(0,0,0,.15)'};background:${h};padding:0"></button>`).join('')}</div>`:'';
  modal({top:`<div class="mkcar" style="padding-bottom:22px"><div id="v4Fig">${car4SVG(r,o.cor,220)}</div>${cores}${zero?`<div id="v4CorNome" style="font:600 12px sans-serif;color:#333;text-align:center">Cor: ${o.cor}</div>`:''}</div>`,t:o.n,x,ch:[{l:`Comprar à vista (${fmt(o.v)})`,fn:()=>MQ.unshift({t:'Concessionária',x:v4Comprar(o,false)})},{l:'Financiar (20% de entrada)',fn:()=>MQ.unshift({t:'Concessionária',x:v4Comprar(o,true)})},{l:'Voltar',cls:'alt'}]}); }
const v4Item=o=>({ic:car4SVG(o.v4,o.cor),l:o.n,s:`${o.cor} · conservação ${o.cond}%${o.classic?' · clássico':''}${o.imp?' · importação':''}`,r:fmt(o.v),on:()=>v4Ficha(o)});
// mais vendidos de cada país (modelos do catálogo)
const VEIC4_TOP={BR:'Strada,Polo,Onix,HB20,Tracker,T-Cross,Argo,Creta,Corolla Cross,Mobi,Hilux,Kicks',AR:'Hilux,Ranger,Cronos,208,Amarok,Yaris,Sandero,Toro,Polo,2008,Tracker,Corolla Cross',
MX:'Versa,March,Sentra,Kicks,Frontier,Jetta,Corolla,RAV4,Tracker,Hilux,Onix,Creta',US:'F-150,Silverado,1500,RAV4,CR-V,Camry,Model Y,Equinox,Tacoma,Corolla,Civic,Explorer',
CA:'F-150,RAV4,CR-V,Silverado,1500,Civic,Corolla,Tacoma,Model Y,Equinox,Tucson,Sportage',PT:'Clio,208,Sandero,Captur,2008,Corsa,Yaris,T-Cross,Polo,Golf,Classe A,Série 1',
ES:'Sandero,Corolla,Arona,Ibiza,Clio,Captur,Tucson,2008,Sportage,T-Cross,Leon,Corsa',FR:'Clio,208,Sandero,2008,Captur,Yaris,3008,Model Y,Corsa,C3,Polo,Zoe',
IT:'Sandero,500,Clio,Captur,T-Cross,Yaris,Corsa,Duster,208,Renegade,Compass,500e',DE:'Golf,Tiguan,Model Y,Polo,Corsa,ID.3,Classe A,Série 3,Fabia,Kodiaq,Classe C,ID.4',
GB:'Sportage,Golf,Model Y,Fiesta,Focus,Polo,Tucson,Classe A,Série 1,Yaris,Defender,Range Rover Evoque',JP:'Yaris,Corolla,Fit,RAV4,Corolla Cross,Jimny,Swift,Land Cruiser,Civic,Camry,Leaf,GR86',
KR:'Sonata,Elantra,Sorento,Sportage,Tucson,Santa Fe,K5,Seltos,Ioniq 5,EV6,Picanto,Grand i10',IN:'Swift,Alto,Dzire,Brezza,Nexon,Creta,Scorpio-N,Thar,Kwid,Seltos,Grand i10,Tigor',
AO:'Hilux,Land Cruiser,Pajero,L200 Triton,Amarok,Polo,RAV4,Corolla,Frontier,Ranger,Tucson,Sportage'};
function v4Top(pais){ const d=v4Disponiveis(pais).filter(r=>!r.classico); return (VEIC4_TOP[pais]||'').split(',').map(m=>d.filter(r=>r.modelo===m).sort((a,b)=>b.ano-a.ano||a.preco-b.preco)[0]).filter(Boolean); }
V.cars=(o=>function(){ if(!S||!S.me) return o.apply(this,arguments); const pais=S.me.country, d=v4Disponiveis(pais);
  const it=[{html:`<div class="card"><p>${d.length} carros reais à venda no meu país. Estoque renovado todo ano; carros de fora saem mais caros e têm peças caras.</p></div>`}];
  const top=v4Top(pais); if(top.length){ const pn=(COUNTRIES.find(c=>c.id===pais)||{n:pais}).n; it.push({sec:`Mais vendidos · ${pn}`}); top.forEach((r,i)=>{ const x=v4Oferta(r); x.n=`${i+1}º · ${x.n}`; it.push(v4Item(x)); }); }
  it.push({sec:'Estoque do ano'}); v4Estoque().forEach(x=>it.push(v4Item(x))); it.push({sec:'Catálogo por categoria'});
  Object.keys(VEIC4_META).forEach(cat=>{ const cs=d.filter(r=>r.cat===cat); if(!cs.length) return; const marcas=[...new Set(cs.map(r=>r.marca))].sort();
    it.push({ic:car4SVG(cs[0],'vermelho'),l:cat,s:`${cs.length} carros · ${marcas.length} marcas`,on:()=>UI.push(()=>({title:cat,items:marcas.map(b=>{ const bs=cs.filter(r=>r.marca===b);
      return {ic:car4SVG(bs[0],'prata'),l:b,s:`${bs.length} versões`,on:()=>UI.push(()=>({title:`${b} · ${cat}`,items:bs.slice().sort((a,b2)=>a.modelo.localeCompare(b2.modelo)||b2.ano-a.ano).map(r=>{ const of=v4Oferta(r); return v4Item(of); })}))}; })}))}); });
  return {title:'Concessionária',items:it}; })(V.cars);
// garagem: desenho do modelo comprado (o ícone do bem passa o nome); peças de carro importado custam mais
const V4_NOME={}; VEICULOS4.forEach(r=>{ V4_NOME[v4Nome(r)]=r; V4_NOME[v4Nome(r)+' 0 km']=r; });
carSVG=(o=>function(md,cor,w){ const r=typeof md==='string'&&(VEIC4[md]||V4_NOME[md]); return r?car4SVG(r,cor,w||undefined):o.apply(this,arguments); })(carSVG);
gastosAno=(o=>function(m){ const it=o.apply(this,arguments); m=m||S.me; (m.assets||[]).filter(a=>a.k==='carro'&&a.manut>1).forEach(a=>it.push(['🔧',`Peças importadas · ${a.n}`,Math.round(a.value*.012*(a.manut-1)*10)])); return it; })(gastosAno);

function veiculos4SelfTest(){ const erros=[], ok=(c,t)=>{ if(!c) erros.push(t); };
  ok(VEICULOS4.length===800,`são ${VEICULOS4.length} carros, não 800`);
  for(const [cat,n] of Object.entries(VEIC4_META)){ const k=VEICULOS4.filter(r=>r.cat===cat).length; ok(k===n,`${cat}: ${k} de ${n}`); }
  ok(new Set(VEICULOS4.map(r=>r.id)).size===VEICULOS4.length,'id repetido');
  VEICULOS4.slice(0,800).forEach(r=>{ if(!r.marca||!r.modelo||!r.versao||!r.ano) erros.push(`registro incompleto ${r.id}`); if(!VEIC4_FORMA[r.forma]) erros.push(`forma ${r.forma}`); });
  ok(/<path/.test(car4SVG(VEICULOS4[0],'azul')),'desenho vazio');
  for(const pais of Object.keys(VEIC4_TOP)) VEIC4_TOP[pais].split(',').forEach(m=>{ if(!VEICULOS4.some(r=>r.modelo===m&&!r.classico&&v4Vende(r,pais))) erros.push(`mais vendido ${m} não está à venda em ${pais}`); });
  return erros; }
