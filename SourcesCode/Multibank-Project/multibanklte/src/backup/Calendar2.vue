<template>
<div>
  <div class="row">
    <div class="col-md-8">

      <div id="add-holiday-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="box-header with-border">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" @click="closeModal">×</span><span class="sr-only">close</span></button>
                    <h4 class="modal-title">Add a Holiday</h4>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label>Enter name</label>
                    <input ref="txtAdd" type="text" :disabled="isTitleDisabled" class="form-control" placeholder=""/>
                  </div>

                <div class="form-group">
                  <label>Date:</label>
                  <div class="input-group date">
                    <div class="input-group-addon">
                      <i class="fa fa-calendar"></i>
                    </div>
                      <date-picker id="datepicker" calendar-class="datepicker" v-model="options.date" class="form-control" :config="options.normal" @dp-change="listenToChangeEvent"></date-picker>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">Close</button>
                  <button type="button" class="btn btn-warning" @click="onSave" data-dismiss="modal" v-bind:disabled="isTitleDisabled">Save</button>
                </div>
            </div>
        </div>
      </div>

      <div id="add-remove-modal" class="modal fade">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="box-header with-border">
                      <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" @click="closeModal">×</span><span class="sr-only" @click="closeModal">close</span></button>
                      <h4 class="modal-title">Delete Holiday</h4>
                  </div>
                  <div id="modalBody" class="modal-body">
                    <div>Are you sure you want to remove this item?</div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-default" @click="closeModal" data-dismiss="modal">No</button>
                      <button class="btn btn-danger" @click="onDelete" data-dismiss="modal">Yes</button>
                  </div>
              </div>
          </div>
      </div>
      </div>
  </div>

  <div class="row">
    <div class="col-md-12">
      <span id="calendar"></span>
    </div>
  </div>
</div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import datePicker from "./datetimepicker/index";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
import axios from "axios";

export default {
  name: "hello",
  data: function(){
    return {
      url: this.$root.$children[0].paths.server_path,
      verbs: this.$root.$children[0].paths.verbs,
      isTitleDisabled: false,
      options: {
        isDisabled: true,
        date: new Date(),
        normal: {
          format: "YYYY/MM/DD"
        }
      },
      selfEL: {},
      MODAL_STATUS: false,
      dateClicked: "",
      event: {}
    };
  },
  mounted() {
    var me = this;
    this.selfEL = $(me.$el);

    me.$on("MODAL_STATUS", function(bool) {
      me.MODAL_STATUS = bool;
    });
    me.$on("REMOVE_EVENT", function(event) {
      me.event = event;
      console.log(me.event.id);
    });
    me.$on("DATE_DAY_CLICKED", function(date) {
      me.dateClicked = date;
      console.log(me.dateClicked.format("YYYY-MM-DD"));
    }); 

    me.$nextTick(function() {
      me.createButtonEL();
    });

    me.createCalendar();

    // var nowTemp = new Date();
    // var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    
    // var checkin = $('#datepicker').datepicker({
    //   onRender: function(date) {
    //     return date.valueOf() < now.valueOf() ? 'disabled' : '';
    //   }
    // }).on('changeDate', function(ev) {
    //   console.log(ev);
    //   if (ev.date.valueOf() > checkout.date.valueOf()) {
    //     var newDate = new Date(ev.date)
    //     newDate.setDate(newDate.getDate() + 1);
    //     checkout.setValue(newDate);
    //   }
    //   checkin.hide();

    // }).data('datepicker');

  },
  methods: {
    createCalendar() {
      var me = this;
      var args = {
        header: {
          left: "prev,next today",
          center: "title",
          right: ""
          // right: "month,agendaWeek,agendaDay"
        },
        locale: "en",
        displayEventTime: false,
        defaultView: "month",
        editable: false,
        droppable: false,
        // eventLimit: 1,
        eventLimit: true,
        events(start, end, timezone, callback) {

          const url = me.url + me.verbs.holiday.holidays
          const holidays = [];
          axios.get(url)
            .then(response => {
              const items = response.data;

              for(var item of items){
                holidays.push({
                  id: item.holidayId,
                  title: item.holidayName,
                  start: moment(item.holidayDate)
                })
              }
              callback(holidays);
            })
            .catch(e => {
              console.log(e);
            });
        },
        dayClick: function(date, allDay, jsEvent, view) {
          me.$emit("DATE_DAY_CLICKED", date);
        },
        dayRender: function(date, element, view) {
          console.log("dayRender!");
        },
        eventClick: function(calEvent, jsEvent, view) {
          var data = calEvent.start.format("YYYY/MM/DD");
          var dia = calEvent.start.format("dddd");
          // console.log(data, dia);

          $("#calendar").fullCalendar("removeEvents", calEvent._id, true);
        },
        eventAfterAllRender: function (view) {
            // Count events
            var quantity = $('.fc-event').length;
            console.log(quantity);
        },
        eventRender: function(event, element) {
          console.log("eventRender!");
          //This task is do while runtime

          // element.append("<span class='fa fa-times fa-2x'>X</span>");

          var divClose = document.createElement("SPAN");
          divClose.classList = "close fa fa-times";
          // divClose.textContent = "x";
          divClose.style = "color:red; font-size: 1.4rem;";
          element.find(".fc-content")[0].appendChild(divClose);

          element.find(".close").click(function() {
            me.$emit("REMOVE_EVENT", event);
            
            $("#add-remove-modal").modal({
              backdrop: "static",
              keyboard: false
            });
            // me.selfEL.fullCalendar("removeEvents", event._id);
          });

          element.bind("dblclick", function(e) {
            // me.$emit("MODAL_STATUS", true);
            // $("#title").html(event.title);
            // $("#add-remove-modal").modal({
            //   backdrop: "static",
            //   keyboard: false
            // });
          });
        }
      };

      // this.selfEL.on("dblclick", function(event) {
      //   var now = moment(event.timeStamp).format("DD-MM-YYYY HH:mm:ss");
      //   var day = moment(event.timeStamp);

      //   const date = new Date(event.timeStamp).toDateString();
      //   var s = new Date(event.timeStamp).toLocaleDateString("en-US");
      //   console.log(s);
      //   console.log(day);

      //   event.preventDefault();
      //   if (!me.MODAL_STATUS) {
      //     $("#add-holiday-modal").modal({ backdrop: "static", keyboard: false });
      //   }
      // });

      // this.selfEL.on("contextmenu", function(e) {
      //   e.preventDefault();
      //   if (e.button == 2) {
      //   }
      // });

      this.selfEL.fullCalendar(args);
    },
    createButtonEL() {
      const me = this;
      var divCreate = document.createElement("DIV");
      var btnCreate = document.createElement("BUTTON");
      btnCreate.setAttribute("data-toggle", "modal");
      // btnCreate.setAttribute("data-target", "#add-holiday-modal");
      btnCreate.classList = "btn btn-warning";
      btnCreate.textContent = "Create New";
      btnCreate.addEventListener("click", function(e) {
        me.$refs.txtAdd.value = "";
        me.doDisabled(new Date());
        $("#add-holiday-modal").modal({ backdrop: "static", keyboard: false });
      });
      divCreate.appendChild(btnCreate);
      document.getElementsByClassName("fc-right")[0].appendChild(divCreate);
    },
    onSave(e) {
      const me = this;
      const eventName = this.$refs.txtAdd.value;
      const dateSelected = this.options.date;
      if (eventName) {
        const eventData = {
          title: eventName,
          start: moment(dateSelected, ["MM-DD-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD")
          // className: "test-class",
          // backgroundColor: '#0073b7',
          // borderColor    : '#0073b7'
        };
        const params = {
          holidayId: null,
          holidayName: eventName,
          holidayDate: moment(this.options.date, ["YYYY-MM-DD"]).format("YYYY-MM-DD")
        };
        axios({
          method: 'post',
          url: this.url + this.verbs.holiday.add,
          data: params
        }).then(function (response) {
          console.log("----------Add Success---------");
          const items = {
            id: response.data.holidayId,
            title: response.data.holidayName,
            start: moment(response.data.holidayDate)
          }
          // me.selfEL.fullCalendar("renderEvent", items, true);
          // console.log(response.data);
          me.selfEL.fullCalendar('refetchEvents');

        }).catch(error => {
          console.log(error.response);
        });
      }
      this.selfEL.fullCalendar("unselect");
    },
    doDisabled(date) {
      const me = this;

      if(me.lessThanCurDate(me.options.date)) return;

      const events = me.selfEL.fullCalendar('clientEvents');
      for (var i = 0; i < events.length; i++) {
          var start_date = new Date(events[i].start._d);
          // var title = events[i].title;
          // var st_day = start_date.getDate();
          // var st_monthIndex = start_date.getMonth() + 1;
          // var st_year = start_date.getFullYear();
          var dateEvent = moment(start_date,"YYYY-MM-DD").format("YYYY-MM-DD");
          var dateAdd = moment(date,"YYYY-MM-DD").format("YYYY-MM-DD");
          if(dateEvent === dateAdd){
            me.isTitleDisabled = true;
            return true;
          }
      }
      me.isTitleDisabled = false;
      return false;
    },
    lessThanCurDate(date){
      var me = this;
      var ds = moment(date, "YYYY-MM-DD");
      var now = moment(new Date(), "YYYY-MM-DD");
      var diff = ds.diff(now, 'days');
      if (diff < 0) {
        me.isTitleDisabled = true;
        return true;
      } else {
        me.isTitleDisabled = false;
      }
      return false;
    },
    onDelete() {
      const me = this;
      const url = me.url + me.verbs.holiday.delete;
      if (me.event.id === undefined) alert("Holiday ID is 'undefined'");

      axios({
          method: 'get',
          url: me.url + me.verbs.holiday.delete+"/"+me.event.id,
        }).then(function (response) {
          console.log("----------Delete Success---------");
          me.selfEL.fullCalendar("removeEvents", me.event._id);
          console.log(response);

        }).catch(error => {
          console.log(error.response.data);
        });
    },
    closeModal() {
      this.$emit("MODAL_STATUS", false);
    },
    listenToChangeEvent(args) {
      const me = this;
      me.doDisabled(this.options.date);

      var nowTemp = new Date();
      var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
      var date = args.date.disabled = true;
      console.log(args.delegateTarget);
      // date.valueOf() <= new Date().date.valueOf() ? 'disabled' : '';

      return date.valueOf() < new Date().valueOf() ? 'disabled' : '';
    }
  },
  components: { datePicker }
};
</script>

<style scoped>
.modal-header {
  /* border-bottom: 1px solid #ccc; */
}

/* .modal-body {
  overflow-y: auto;
} */
</style>
