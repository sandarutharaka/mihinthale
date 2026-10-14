import {toLocal} from '../../src/geo/coordinates';
import {test,expect} from '@playwright/test';
test('selection, share hash, languages and layout',async({page,isMobile})=>{
 await page.goto('/');await expect(page.getByText('Source terrain · approximate landmark models',{exact:true})).toBeVisible();
 if(isMobile)await page.getByRole('button',{name:'Landmarks',exact:true}).click();
 await page.getByRole('button',{name:/01.*Maha Seya/}).click();await expect(page.getByRole('heading',{name:'Maha Seya',exact:true})).toBeVisible();await expect(page).toHaveURL(/landmark=maha-seya/);
 await page.reload();await expect(page.getByRole('heading',{name:'Maha Seya',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Switch to Sinhala'}).click();await expect(page.getByRole('heading',{name:'මහා සෑය',exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('tour start, pause, resume, next, previous, manual interruption',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Guided tour',exact:true}).click();await expect(page.getByRole('heading',{name:'Main stairway & terraces',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('button',{name:'Resume',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.getByRole('heading',{name:'Ambasthala Stupa',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Previous',exact:true}).click();await expect(page.getByRole('heading',{name:'Main stairway & terraces',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.getByRole('button',{name:'Rotate left',exact:true}).click();await expect(page.getByRole('button',{name:'Resume',exact:true})).toBeVisible();
});
test('WebGL fallback retains useful landmark information',async({page,isMobile})=>{
 await page.addInitScript(()=>{const native=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return native.apply(this,[type,...args] as never)} as typeof native});
 await page.goto('/');await expect(page.getByRole('heading',{name:'Explore without 3D'})).toBeVisible();
 if(isMobile)await page.getByRole('button',{name:'Landmarks',exact:true}).click();await page.getByRole('button',{name:/01.*Maha Seya/}).click();await expect(page.getByRole('heading',{name:'Maha Seya',exact:true})).toBeVisible();
});
test('missing local data shows preview, reduced motion and labels work',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.route('**/data/scene.json',route=>route.fulfill({status:404,body:''}));await page.goto('/');await expect(page.getByText('Local geographic data could not be loaded. Showing the labeled preview.')).toBeVisible();
 await page.getByRole('checkbox',{name:'Labels',exact:true}).uncheck();await expect(page.locator('.landmark-marker')).toHaveCount(0);
 await expect(page.getByRole('checkbox',{name:/Mapped paths/})).toBeDisabled();
});

test('3D renders without runtime errors and captures the layout',async({page,isMobile})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 await page.goto('/');await expect(page.locator('.landmark-marker')).toHaveCount(11);await expect(page.getByRole('heading',{name:'Explore without 3D'})).toHaveCount(0);
 await page.screenshot({path:'docs/screenshots/'+(isMobile?'mobile':'desktop')+'.png',fullPage:true});
 await page.getByRole('button',{name:'Guided tour',exact:true}).click();await expect(page.getByRole('heading',{name:'Main stairway & terraces',exact:true})).toBeVisible();await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.screenshot({path:'docs/screenshots/'+(isMobile?'mobile':'desktop')+'-tour.png',fullPage:true});
 expect(errors).toEqual([]);
});

test('normal motion and direct canvas drag interrupt the tour',async({page,isMobile})=>{
 test.skip(isMobile,'Desktop pointer test; mobile controls covered separately');
 await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');await expect(page.locator('.landmark-marker')).toHaveCount(11);
 const bearing=page.locator('.overview-map svg > g').first();const before=await bearing.getAttribute('transform');
 await page.getByRole('button',{name:'Guided tour',exact:true}).click();
 await expect.poll(()=>bearing.getAttribute('transform')).not.toBe(before);
 await page.mouse.move(750,420);await page.mouse.down();await page.mouse.move(820,450,{steps:8});await page.mouse.up();
 await expect(page.getByRole('button',{name:'Resume',exact:true})).toBeVisible();
});

test('detailed Buddha asset and mapped ruins are selectable',async({page,isMobile})=>{
 test.skip(isMobile,'Close-up visual review is desktop only');
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#landmark=white-buddha');await expect(page.locator('.landmark-marker')).toHaveCount(11);await expect(page.getByRole('heading',{name:'White Buddha statue',exact:true})).toBeVisible();
 await page.getByRole('checkbox',{name:'Labels',exact:true}).uncheck();
 const [bx,bz]=toLocal(80.5176702,8.3519428);await expect.poll(async()=>Math.abs(Number(await page.locator('.overview-map svg').getAttribute('data-target-x'))-bx)).toBeLessThan(1);await expect.poll(async()=>Math.abs(Number(await page.locator('.overview-map svg').getAttribute('data-target-z'))-bz)).toBeLessThan(1);await page.screenshot({path:'docs/screenshots/buddha-detail.png'});
 await page.getByRole('button',{name:/Assembly Hall.*Monastic ruins/}).click();await expect(page.getByRole('heading',{name:'Assembly Hall',exact:true})).toBeVisible();
 await page.waitForTimeout(800);await page.screenshot({path:'docs/screenshots/ruins-detail.png'});
 await page.getByRole('button',{name:/Main stairway.*Stone stairway/}).click();
 await page.waitForTimeout(800);await page.screenshot({path:'docs/screenshots/stairs-detail.png'});expect(errors).toEqual([]);
});
