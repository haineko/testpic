var Site = (function($){

	var is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		is_safari = (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1);

	function screenSize(){
		if ($(window).outerWidth(true) > 1440) {
			return true;
		} else {
			return false;
		}
	}


	function getSize(px){
		if (screenSize())
			return px/16+"rem";
		else
			return px;
	}


	var PageSlides = {
		init : function(){
			var that = this;

			$("#fullpage").fullpage({
				verticalCentered : false,
				scrollOverflow: true,
				css3: true,
				scrollingSpeed: 500,

				onLeave: function(index, nextIndex, direction){
					if (!that.styles.scrollTo(index, direction))
						return false;
					that.scrollAction(index, nextIndex, direction);
					that.nav.moveMinPointerTo(nextIndex);
					that.nav.moveMaxPointerTo(nextIndex);
				},

		        afterLoad: function(anchorLink, index){
		        	that.nav.moveMinPointerTo(index);
		        	that.nav.moveMaxPointerTo(index);
		        }
			});

			this.nav.create();
			this.styles.init();
		},

		scrollAction : function(index, nextIndex, direction){
			switch(nextIndex){
				case 1: PageSlides.render.intro(); break;
				case 2: PageSlides.render.service(); break;
				case 3: PageSlides.render.about(); break;
				case 4: PageSlides.render.styles(); break;
				case 5: PageSlides.render.contact(); break;

				default: break;
			}
		},

		render : {
			commonExceptIntro : function(section){
				$(".stripe").removeClass("hideBlocks");
				$(".stripe").css("background", $(".section."+section).attr("data-stripe-bg"));
			},

			commonExceptContact : function(){
				if ($("#getModel").hasClass("out")) {
					$("#getModel").fadeIn(200, function(){
						$(this).removeClass("out");
					});
				}
			},

			intro : function(){
				$(".stripe").addClass("hideBlocks");
				$(".stripe").css("background", $(".section.intro").attr("data-stripe-bg"));

				this.commonExceptContact();
			},

			service : function(){ 
				this.commonExceptIntro("service");
				this.commonExceptContact();
			},

			about : function(){ 
				this.commonExceptIntro("about");
				$("#getModel").fadeOut(200, function(){
					$(this).addClass("out");
				});
			},

			styles : function(){ 
				this.commonExceptIntro("styles");
				this.commonExceptContact();
			},

			contact : function(){ 
				this.commonExceptIntro("contact");
				$("#getModel").fadeOut(200, function(){
					$(this).addClass("out");
				});
			}
		},

		nav : {
			$nav : null,
			$ul : null,
			$pointerMin : null,
			$pointer : null,

			create : function(){
				var that = this;

				var navRight = screenSize() ? 0 : -1*getSize(55);
				var pointerMinWidth = screenSize()? 0 : getSize(5);

				// Creating main block
				this.$nav = $("<nav></nav>").css({
					position: "fixed", zIndex: 80,
					width: getSize(60), height: "100%",
					top: 0, right: navRight,
					background: "#fff",
					fontSize: "100%"
				}).prependTo("body");

				// Creating minimal pointer
				this.$pointerMin = $("<div></div>").css({
					position: "absolute",
					width: pointerMinWidth, background: "#ff3703",
					left: 0, display: "none"
				}).appendTo(this.$nav);

				// Creating big pointer
				this.$pointer = $("<div></div>").css({
					position: "absolute",
					left: 0,
					width: getSize(60), height: getSize(60),
					backgroundRepeat: "no-repeat",
					backgroundImage: "url(img/scroll.png)",
					backgroundPosition: "60% 50%",
					backgroundSize: "50%",
					display: "none"
				}).appendTo(this.$nav);

				// Creating menu list
				this.$ul = $("<ul></ul>").css({
					margin: 0, padding: 0, 
					height: "100%", width: "100%"
				}).appendTo(this.$nav);

				// Creating menu elements
				$(".section").each(function(n, el){
					var $li = $("<li></li>").css({
						listStyle: "none", width: "100%", 
						position: "relative"
					}).appendTo(that.$ul);

					var $div = $("<div></div>")
						.appendTo($li);

					var $a = $("<a></a>")
						.attr("href", "#" + $(el).attr("data-anchor"))
						.attr("data-menuanchor", $(el).attr("data-anchor"))
						.html( $(el).attr("data-menu").replace(/,/g, "<br>") )
						.appendTo($div);
				});

				// Setting styles for menu elements
				var liCount = $(this.$ul).find("li").length;
				var liHeight = (100/liCount) + "%";
				$(this.$ul).find("li").each(function(n, el){
					$(el).css("height", liHeight);

					var $div = $(el).children("div"),
						$a = $div.children("a"),
						pHeight = $(el).height(),
						pWidth = $(el).width();

					$div.addClass("rotated").css({
						width: pHeight, height: pWidth,
						position: "relative",
						left: -1*pHeight,
						textAlign: "center"
					});

					$a.css({
						display: "inline-block",
						height: pWidth,
						fontFamily: "Stem_regular", fontSize: "0.8em",
						textDecoration: "none", textTransform: "uppercase",
						padding: "0.9375rem 0.3125rem", boxSizing: "border-box",
						color: "#000", textAlign: "left"
					});
				});

				this.actions();
			},

			actions : function(){
				var that = this;
				
				this.$nav.hover(
					function(e){ if(!screenSize()) that.expand(); },
					function(e){ if(!screenSize()) that.rollUp(); }
				);
			},

			expand : function(){
				TweenLite.to( this.$pointerMin, 0.1, { css: {width: 0}, ease: Power4.easeOut, delay: 0 } );
				TweenLite.to( this.$nav, 0.1, { css: {right: 0}, ease: Power4.easeOut, delay: 0 } );
			},

			rollUp : function(){
				TweenLite.to( this.$pointerMin, 0.1, { css: {width: getSize(5)}, ease: Power4.easeOut, delay: 0 } );
				TweenLite.to( this.$nav, 0.1, { css: {right: -1*getSize(55)}, ease: Power4.easeOut, delay: 0 } );
			},

			moveMinPointerTo : function(position){
				var $currentLi = $(this.$ul.find("li")[position-1]);
				var $currentLiHeight = $currentLi.height();
				var $currentAWidth = $currentLi.find("a").outerWidth();
				var pTop = $currentLiHeight*(position-1) + ($currentLiHeight/2 - $currentAWidth/2);
				var pHeight = $currentAWidth;

				TweenLite.set( this.$pointerMin, {display: "block"});
				TweenLite.to( this.$pointerMin, 0.3, { css: {height: pHeight, top: pTop}, ease: Power4.easeOut, delay: 0 } );
			},

			moveMaxPointerTo : function(position){
				this.$ul.find("li").each(function(n, el){
					if (n == position-1) {
						TweenLite.to( $(el), 0.3, { css: {opacity: 0}, ease: Power4.easeOut, delay: 0,
							onComplete : function(){
								$(el).addClass("out");
							}
						} );
					} else {
						if($(el).hasClass("out")){
							TweenLite.to( $(el), 0.3, { css: {opacity: 1}, ease: Power4.easeOut, delay: 0,
								onComplete : function(){
									$(el).removeClass("out");
								}
							} );
						}
					}
				});

				var $currentLi = $(this.$ul.find("li")[position-1]);
				var $currentLiHeight = $currentLi.height();
				var $currentAWidth = $currentLi.find("a").outerWidth();
				var pTop = $currentLiHeight*(position-1) + ($currentLiHeight/2 - this.$pointer.height()/2);
				var pHeight = $currentAWidth;

				TweenLite.set( this.$pointer, {display: "block"});
				TweenLite.to( this.$pointer, 0.3, { css: {top: pTop}, ease: Power4.easeOut, delay: 0 } );
			}
		},

		styles : {
			currentStyle : null,

			animation : false,

			styleList : [
				{
					title: "фото",
					image: "img/styles/style1.png",
					sq_big: [6630, 4640], sq_mid: [3130, 2190], sq_sm: [1690, 1190],
					re_big: [10200, 7140], re_mid: [3270, 2260], re_sm: [1990, 1390]
				},

				{
					title: "коллаж",
					image: "img/styles/style1.png",
					sq_big: [7420, 5430], sq_mid: [3920, 2980], sq_sm: [2480, 1980],
					re_big: [10990, 7930], re_mid: [4060, 3050], re_sm: [2780, 2180]
				},

				{
					title: "поп арт",
					image: "img/styles/style1.png",
					sq_big: [6630, 4640], sq_mid: [3130, 2190], sq_sm: [2680, 2180],
					re_big: [11190, 8130], re_mid: [4260, 3250], re_sm: [2980, 2380]
				},
        
        {
					title: "модульные картины",
					image: "img/styles/style1.png",
					sq_big: [6630, 4640], sq_mid: [3130, 2190], sq_sm: [1690, 1190],
					re_big: [10200, 7140], re_mid: [3270, 2260], re_sm: [1990, 1390]
				}
			],

			init : function(){
				// Make dots
				for(var i = 0; i < this.styleList.length; i++){
					$("#styleDots").append("<li><a href='#' data-index='"+i+"'></a></li>");
				}

				this.currentStyle = 0;
				$("#styleDots li a[data-index='0']").addClass("active");
				this.setPrice(this.styleList[ this.currentStyle ].sq_big[0], this.styleList[ this.currentStyle ].sq_big[1]);

				this.setHandlers();
			},

			setHandlers : function(){
				var that = this;

				$("#sizeWrap .preview").on("click", function(e){
					console.log('hover test');
					var type = $(this).attr("data-type");
					that.setPrice(that.styleList[ that.currentStyle ][type][0], that.styleList[ that.currentStyle ][type][1]);
				});

				$("#styleDots a").on("click", function(e){
					e.preventDefault();

					that.goTo( $(this).attr("data-index") );
				});
			},

			setPrice : function(discount, current){
				$("#price span").html(discount);
				$("#price i").html(current);

				var min = 1, max = 39;
				var emoji =  Math.floor(Math.random() * (max - min) + min);
				var emoji_link = emoji > 9 ? "00"+emoji : "000" + emoji;
				$("#price .sticker").css("background-image", "url(img/emoji/"+emoji_link+".png)");
			},

			goTo : function(index){
				var that = this;
				if (this.animation) return false;

				$("#styleDots a").removeClass("active");
				$("#styleDots a[data-index='"+index+"']").addClass("active");

				TweenLite.to( $("#sizePhoto"), 0.3, { 
					css: { y: 15, opacity: 0 }, 
					ease: Power4.easeOut, 
					delay: 0,
					onStart: function(){
						that.animation = true;
					},
					onComplete: function(){
						that.currentStyle = index;
						$("#sizePhoto").css("background-image", "url("+that.styleList[index].image+")");
					}
				});
				TweenLite.to( $("#sizePhoto"), 0.3, { 
					css: { y: 0, opacity: 1 }, 
					ease: Power4.easeOut, 
					delay: 0.3,
					onComplete: function(){
						that.animation = false;

						that.setPrice(that.styleList[ that.currentStyle ].sq_big[0], that.styleList[ that.currentStyle ].sq_big[1]);
					}
				});
			},

			scrollTo : function(index, direction){
				if(this.animation) return false;

				if (index == 4) {
					if (direction == "up") {
						if (this.currentStyle-1 >= 0) {
							this.goTo( this.currentStyle-1 );
						} else return true;
					} else {
						if (this.currentStyle+1 < this.styleList.length) {
							this.goTo( this.currentStyle+1 );
						} else return true;
					}
				} else return true;
			}
		}
	}


	var Animations = {
		navBlock : function(){
			$('[data-open="nav"]').on('click', function(e) {
				e.preventDefault();
				var target = $(this).attr("data-target");

				TweenLite.to( $(".menu_open"), 0.2, { css: { opacity: 0 }, ease: Power4.easeOut, delay: 0 });
				TweenLite.set(target, {perspective: 800});
				TweenLite.set(target, {transformStyle: "preserve-3d"});
				if ( is_safari ) {
					TweenLite.to( $(target), 0, { css: { display: 'none', opacity: 0 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target+" .main_wrap"), 0, { css: { opacity: 0, y: 60 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target), 0.6, { css: { display: 'block', opacity: 1 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target+" .main_wrap"), 0.6, { css: { opacity: 1, y: 0 }, ease: Power4.easeOut, delay: 0 });
				} else {
					TweenLite.to( $(target), 0, { css: { display: 'none', opacity: 0 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target+" .main_wrap"), 0, { css: { opacity: 0, rotationX: -15, scale: 0.9, y: 60 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target), 0.6, { css: { display: 'block', opacity: 1 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target+" .main_wrap"), 0.6, { css: { opacity: 1, rotationX: 0, scale: 1, y: 0 }, ease: Power4.easeOut, delay: 0 });
				}
			});

			$('[data-close="nav"]').on('click', function(e) {
				e.preventDefault();
				var target = $(this).attr("data-target");

				TweenLite.to( $(".menu_open"), 0.2, { css: { opacity: 1 }, ease: Power4.easeOut, delay: 0 });
				TweenLite.set(target, {perspective: 800});
				TweenLite.set(target, {transformStyle: "preserve-3d"});
				if ( is_safari ) {
					TweenLite.to( $(target), 0.6, { css: { display: 'none', opacity: 0 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target+" .main_wrap"), 0.6, { css: { opacity: 0, y: 0 }, ease: Power4.easeOut, delay: 0 });
				} else {
					TweenLite.to( $(target), 0.6, { css: { display: 'none', opacity: 0 }, ease: Power4.easeOut, delay: 0 });
					TweenLite.to( $(target+" .main_wrap"), 0.6, { css: { opacity: 0, rotationX: 0.1, scale: 0.95, y: 0 }, ease: Power4.easeOut, delay: 0 });
				}
				
			});
		},

		menuBlock : function(){
			$('.menu_list li').on('mouseenter', function() {
				if ( !$(this).hasClass('hover') ) {
					var $submenu = $(this).children('ul'),
						submenu_height = $submenu.height();

					$submenu.css('height', '0px');
					$(this).addClass('hover');
					$submenu.animate( {
						height: submenu_height + 'px',
					},'600','easeOutExpo');

					var $elem = $submenu.find('li');
					TweenLite.to( $elem, 0, { css: { opacity: 0, y: 15 }, ease: Expo.easeOut, delay: 0 });
					TweenLite.to( $elem, 0.6, { css: { opacity: 1, y: 0 }, ease: Expo.easeOut, delay: 0.3 });
				}
			});

			$('.menu_list').on('mouseleave', function() {
				var $submenu = $(this).find('ul'),
					$this = $(this);

				$submenu.animate( {
					height: '0',
				}, '400', 'easeOutExpo', function() {
					$submenu.css('height','');
					$submenu.parent().removeClass('hover');
				});
			});
		},

		aboutBlock : function(){
			$(".about_block.recall").on("mouseenter", function(e){
				var that = this,
					$parent = $(that),
					$layer = {
						wrap : $(that).children(".layer"),
						photo : $(that).children(".layer").find(".photo"),
						text : $(that).children(".layer").find("div"),
						name : $(that).children(".layer").find(".name")
					};

				TweenLite.set( $layer.wrap, {scale: 0.95});
				TweenLite.to( $layer.wrap, 0.3, { css: { scale: 1, opacity: 1 }, ease: Power4.easeOut, delay: 0 } );
			});

			$(".about_block.recall").on("mouseleave", function(e){
				var that = this,
					$parent = $(that),
					$layer = {
						wrap : $(that).children(".layer"),
						photo : $(that).children(".layer").find(".photo"),
						text : $(that).children(".layer").find("div"),
						name : $(that).children(".layer").find(".name")
					};

				TweenLite.to( $layer.wrap, 0.3, { css: { scale: 0.95, opacity: 0 }, ease: Power4.easeOut, delay: 0 } );
			});
		},

		topLineBlock : function(){
			var o = this;
			$(".stripe .call > a").on("click", function(e){
				e.preventDefault();
				$block = $(this).next("div");
				$block.fadeIn(200, function(){ 
					$block.toggleClass("opened"); 
				});
				$("<div class='backdrop'></div>")
				.prependTo($(this).parent().parent())
				.css({
					position: "fixed",
					top: 0, left: 0,
					width: "100%", height: "100%",
					zIndex: 1001,
					background: "transparent"
				});
				o.backdropHandler();
			});
		},

		backdropHandler : function(){
			$(".backdrop").on("click", function(e){
				$(".stripe .call > div").fadeOut(200, function(){ 
					$(".stripe .call > div").removeClass("opened"); 
				});
				$(this).remove();
			});
		}
	}


	this.initialize = function(){
		PageSlides.init();
		Animations.navBlock();
		Animations.menuBlock();
		Animations.topLineBlock();
		Animations.aboutBlock();

		if (screenSize) {
			var relativeSize = (100*$(window).outerWidth(true)/1366)+"%";
			$("html").css("font-size", relativeSize);
		}
	}();


	return {};
})(jQuery);