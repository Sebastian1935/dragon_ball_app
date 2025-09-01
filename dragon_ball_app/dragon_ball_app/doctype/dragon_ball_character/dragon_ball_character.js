// Copyright (c) 2025, Sebastian and contributors
// For license information, please see license.txt

frappe.ui.form.on("Dragon Ball Character", {   
    refresh(frm) {
        if (frm.is_new()) {
            frm.add_custom_button(__('Sync All Characters'), function() {
                frappe.show_alert({
                    message: __('Syncing all characters... This may take a few seconds'),
                    indicator: 'blue'
                }, 5);
                
                const sync_button = frm.custom_buttons[__('Sync All Characters')];
                if (sync_button) {
                    sync_button.prop('disabled', true);
                    sync_button.html(__('Syncing...'));
                }
                
                frappe.call({
                    method: 'dragon_ball_app.dragon_ball_app.doctype.dragon_ball_character.dragon_ball_character.sync_all_characters',
                    callback: function(r) {
                        if (sync_button) {
                            sync_button.prop('disabled', false);
                            sync_button.html(__('Sync All Characters'));
                        }
                        
                        if (r.message) {
                            console.log("Transformations:", r.message);
                            frappe.show_alert({
                                message: __('Characters synced successfully!'),
                                indicator: 'green'
                            }, 8);
                            frm.reload_doc();
                        }
                    },
                    error: function() {
                        if (sync_button) {
                            sync_button.prop('disabled', false);
                            sync_button.html(__('Sync All Characters'));
                        }
                        frappe.show_alert({
                            message: __('Error during synchronization'),
                            indicator: 'red'
                        }, 5);
                    }
                });
            });
        }

        if (!frm.is_new() && frm.doc.character_id) {
            frm.add_custom_button(__('Update This Character'), function() {
                frappe.call({
                    method: 'dragon_ball_app.dragon_ball_app.doctype.dragon_ball_character.dragon_ball_character.update_single_character',
                    args: {
                        character_id: frm.doc.character_id
                    },
                    callback: function(r) {
                        if (r.message) {
                            frappe.msgprint(__('Character updated successfully!'));
                            frm.reload_doc();
                        }
                    }
                });
            });
        }
    },
});