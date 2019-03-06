<template>
<div class="row">
  <div class="col-md-12">
    <div class="form-group">
      <button type="button" class="btn btn-info" data-toggle="modal"
              data-target="#add-event-modal">
        Create New
      </button>
    </div>

    <div class="modal fade" tabindex="-1" role="dialog" id="add-event-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">close</span></button>
                    <h4 class="modal-title">Add a Holiday</h4>
                </div>
                 <div class="modal-body">
                  <div class="form-group">
                    <input type="text" class="form-control" placeholder="Enter name"/>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-warning" data-dismiss="modal">Save</button>
                </div>
            </div>
        </div>
    </div>

    <div id="fullCalModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span> <span class="sr-only">close</span></button>
                    <h4 id="modalTitle" class="modal-title"><span id="title"></span></h4>
                </div>
                <div id="modalBody" class="modal-body">
                    เวลาที่เริ่ม: <span id="startTime"></span><br>
                    เวลาที่สิ้นสุด: <span id="endTime"></span><br><br>
                    <p id="eventInfo"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button class="btn btn-primary">Event Page</button>
                </div>
            </div>
        </div>
    </div>

    <full-calendar
      ref="calendar"
      id="calendar"
      :config="config"
      :events="events"/>

  </div>
</div>
</template>

<script>
import $ from 'jquery'
import moment from "moment";

export default {
  name: "hello",
  data() {
    return {
      options: [
        {
          name: "Delete",
          slug: "delete"
        }
      ],
      events: [],
      config: {
        locale: "th",
        defaultView: "month",
        editable  : true,
        droppable : true,
        events(start, end, timezone, callback) {
          // self.$http.get(`/myFeed`, {timezone: timezone}).then(response => {
          //   callback(response.data.data)
          // })

          callback([
				{
					title: 'Long Event',
					 start: '2015-10-10 12:30:00',
          end: '2015-10-10 16:30:00'
				},
				{
					title: 'Click for Google',
					// url: 'http://google.com/',
          start: moment().add(4),
          end: moment()
                .add(2, "d")
            }
          ])
        },

        dayClick:function( date, allDay, jsEvent, view ) {
          console.log("date: " + date);
        },
        dayRender: function(date, element, view){
           console.log("dayRender!");
        },
        eventRender: function(event, element) {
          const me = this;
          console.log("eventRender!");
          var data = event.start.format("YYYY-MM-DD");
          var dia = event.start.format("dddd");
          console.log(data, dia);


          $(element).tooltip({title: event.title, start: data, end: dia});

          element.bind('dblclick', function(eventE, jsEvent, view) {
            $(this).css('border-color', 'red');
            $(this).css('background-color', 'black');

            $("#title").html(event.title);
            $("#startTime").html(moment(event.start).format('MMM Do h:mm A'));
            $("#endTime").html(moment(event.end).format('MMM Do h:mm A'));
            $("#eventInfo").html(event.description);
            $("#eventLink").attr('href',event.url);
            $('#fullCalModal').modal();

          });

          element.contextmenu(function(e) {
            var menu = document.getElementById("vue-simple-context-menu")
            if (!menu) {
                return
            }

            if(!this.menuWidth || !this.menuHeight) {
                menu.style.visibility = "hidden"
                menu.style.display = "block"
                this.menuWidth = menu.offsetWidth
                this.menuHeight = menu.offsetHeight
                menu.removeAttribute("style")
            }
            var left = e.pageX - 250, top = e.pageY - 50;
            menu.style.left = left + "px";
            menu.style.top = top + "px";
            menu.position = "fixed";
            menu.classList.add("dropdown-menu");
            menu.classList.add('vue-simple-context-menu--active')
          });

        },
        eventAfterRender(event) {
          console.log("eventafterRender!");
           if(event.fromSelect){
                alert("Created!")
            }
        },
        eventClick: function(event, jsEvent, view){
          var data = event.start.format("YYYY-MM-DD");
          var dia = event.start.format("dddd");
          console.log(data, dia);
          console.log('Event: ' + view.title);
          console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
          console.log('View: ' + view.name);
        },
        select(start, end, jsEvent, view) {
          var data = start.format("YYYY-MM-DD");
          var dia = start.format("dddd");

          console.log("select!");
          console.log(data);
          console.log(dia);
          console.log(jsEvent);
          console.log(view);
        },
        selectAllow() {
          console.log("selectAllow!");
        },
        selectable() {
          console.log("selectable!");
        }
      }
    };
  },
  mounted() {
    const me = this;

    $('#calendar:not("td.fc-widget-content")').on('contextmenu' , function(e){
      e.preventDefault()
      if(e.button==2){ }
    })
  },
  methods: {
    hideContextMenu () {
        document.getElementById("vue-simple-context-menu").classList.remove('vue-simple-context-menu--active');
    },
    handleClick(event, item) {
      this.$refs.vueSimpleContextMenu.showMenu(event, item);
    },
    optionClicked(event) {
      console.log(JSON.stringify(event));
    }
  },
  components: {}
};
</script>

<style scoped>
.modal-header {
  border-bottom: 1px solid yellow;
}
.custom-menu {
  display: none;
  z-index: 1000;
  position: absolute;
  overflow: hidden;
  border: 1px solid #CCC;
  white-space: nowrap;
  font-family: sans-serif;
  background: #FFF;
  color: #333;
  border-radius: 5px;
  padding: 0;
}

.custom-menu li {
  padding: 8px 12px;
  cursor: pointer;
  list-style-type: none;
  transition: all .3s ease;
}

.custom-menu li:hover {
  background-color: #DEF;
}
</style>

