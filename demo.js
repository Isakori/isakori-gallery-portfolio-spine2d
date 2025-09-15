const app = new PIXI.Application({
    backgroundColor:0xFFFFFF,
    antialias:true,
    width:800,
    height:600
});

document.getElementById('app').appendChild(app.view);

let loader = PIXI.loader.add('junko', './Junko.json');

loader.load((loader,res)=>{
    let junko = new PIXI.spine.Spine(res.junko.spineData)
        options = [''];
    // Junko -----------------------------------
    junko.scale.set(0.25);
    junko.state.setAnimation(0, '-finalAnimation', true);
    junko.x = 400;
    junko.y = 280;
    junko.drawDebug = false;

    app.stage.addChild(junko);

    // debug ui
    // let spineboyCheckboxs = document.getElementsByName('spineboy'),
    //     vineCehckboxs = document.getElementsByName('vine'),
    //     debugOptions = ['drawBones','drawRegionAttachments','drawClipping','drawMeshHull','drawMeshTriangles','drawPaths','drawBoundingBoxes'],
    //     setDebug = function(index){
    //         let name = this.name,
    //             spine = name === 'spineboy' ? spineboy : name === 'vine' ? vine : undefined;
    //         if(!spine){return;};
    //         spine[debugOptions[index]] = this.checked;
    //     },
    //     fn = (item,index) => {
    //         setDebug.call(item,index);
    //         let label = item.nextElementSibling;
    //         if(label.tagName === 'LABEL'){
    //             label.innerHTML = debugOptions[index];
    //         };
    //         item.onchange = function(){
    //             setDebug.call(this,index);
    //         };
    //     };
    
    // spineboyCheckboxs.forEach(fn);
    // vineCehckboxs.forEach(fn);
});